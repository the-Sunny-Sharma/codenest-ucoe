import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Mux from "@mux/mux-node";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(request: Request) {
  console.log("🔍 POST /api/mux/live-stream - Starting to create live stream");
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ POST /api/mux/live-stream - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId } = await request.json();
    console.log("🔍 POST /api/mux/live-stream - Request params:", {
      courseId,
      chapterId,
    });

    if (!courseId || !chapterId) {
      console.log("❌ POST /api/mux/live-stream - Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new live stream
    console.log("🔍 POST /api/mux/live-stream - Creating Mux live stream");
    const stream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
    });

    console.log("✅ POST /api/mux/live-stream - Created Mux stream:", {
      id: stream.id,
      stream_key: stream.stream_key,
      playback_ids: stream.playback_ids
        ? JSON.stringify(stream.playback_ids)
        : "none",
      status: stream.status,
    });

    // Ensure we have playback IDs
    if (!stream.playback_ids || stream.playback_ids.length === 0) {
      console.log(
        "⚠️ POST /api/mux/live-stream - No playback IDs found, creating one"
      );
      try {
        // Create a playback ID if none exists
        const playbackIdResponse = await mux.video.liveStreams.createPlaybackId(
          stream.id,
          { policy: "public" }
        );

        console.log(
          "✅ POST /api/mux/live-stream - Created new playback ID:",
          playbackIdResponse
        );

        // Refresh stream data to get the new playback ID
        console.log("🔍 POST /api/mux/live-stream - Retrieving updated stream");
        const updatedStream = await mux.video.liveStreams.retrieve(stream.id);

        console.log(
          "✅ POST /api/mux/live-stream - Updated stream with new playback ID:",
          {
            stream_key: updatedStream.stream_key,
            playback_ids: updatedStream.playback_ids
              ? JSON.stringify(updatedStream.playback_ids)
              : "none",
            status: updatedStream.status,
          }
        );

        // Use the updated stream for the rest of the function
        stream.playback_ids = updatedStream.playback_ids;
      } catch (error) {
        console.error(
          "❌ POST /api/mux/live-stream - Error creating playback ID:",
          error
        );
      }
    }

    await connectToDatabase();
    console.log("🔍 POST /api/mux/live-stream - Finding course:", courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ POST /api/mux/live-stream - Course not found");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the section and chapter
    console.log("🔍 POST /api/mux/live-stream - Finding chapter:", chapterId);
    let foundChapter = null;
    let sectionIndex = -1;
    let chapterIndex = -1;

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];
      console.log(
        `🔍 POST /api/mux/live-stream - Checking section ${i}, with ${section.chapters.length} chapters`
      );

      const cIndex = section.chapters.findIndex((c) => {
        const chapterId_str = c._id ? c._id.toString() : "undefined";
        console.log(
          `🔍 POST /api/mux/live-stream - Comparing chapter ID: ${chapterId_str} with ${chapterId}`
        );
        return c._id && c._id.toString() === chapterId;
      });

      if (cIndex !== -1) {
        foundChapter = section.chapters[cIndex];
        sectionIndex = i;
        chapterIndex = cIndex;
        console.log(
          `✅ POST /api/mux/live-stream - Found chapter at section ${i}, index ${cIndex}`
        );
        break;
      }
    }

    if (!foundChapter) {
      console.log("❌ POST /api/mux/live-stream - Chapter not found");
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Ensure we have a playback ID
    const playbackId =
      stream.playback_ids && stream.playback_ids.length > 0
        ? stream.playback_ids[0].id
        : null;

    console.log("🔍 POST /api/mux/live-stream - Playback ID:", playbackId);

    if (!playbackId) {
      console.log(
        "❌ POST /api/mux/live-stream - Failed to create playback ID"
      );
      return NextResponse.json(
        { error: "Failed to create playback ID" },
        { status: 500 }
      );
    }

    // Update the chapter with stream details
    console.log(
      "🔍 POST /api/mux/live-stream - Updating chapter with stream details"
    );
    course.sections[sectionIndex].chapters[chapterIndex].streamKey =
      stream.stream_key;
    course.sections[sectionIndex].chapters[chapterIndex].playbackId =
      playbackId;
    course.sections[sectionIndex].chapters[chapterIndex].isLive = false;
    course.sections[sectionIndex].chapters[chapterIndex].muxStreamId =
      stream.id; // ✅ Store Mux Stream ID

    console.log(
      "✅ POST /api/mux/live-stream - Updated chapter with stream details:",
      {
        streamKey: stream.stream_key,
        playbackId,
        chapterId,
      }
    );

    // Save the changes
    console.log("🔍 POST /api/mux/live-stream - Saving course document");
    await course.save();

    console.log("✅ POST /api/mux/live-stream - Updated course document:", {
      chapterStreamKey:
        course.sections[sectionIndex].chapters[chapterIndex].streamKey,
      chapterPlaybackId:
        course.sections[sectionIndex].chapters[chapterIndex].playbackId,
    });

    return NextResponse.json({
      streamKey: stream.stream_key,
      playbackId,
    });
  } catch (error) {
    console.error(
      "❌ POST /api/mux/live-stream - Error creating live stream:",
      error
    );
    return NextResponse.json(
      { error: "Failed to create live stream" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log(
    `🔍 GET ${url.pathname}${url.search} - Starting to fetch stream details`
  );

  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log(`❌ GET ${url.pathname} - Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = url;
    const courseId = searchParams.get("courseId");
    const chapterId = searchParams.get("chapterId");

    console.log(`🔍 GET ${url.pathname} - Request params:`, {
      courseId,
      chapterId,
    });

    if (!courseId || !chapterId) {
      console.log(`❌ GET ${url.pathname} - Missing required fields`);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log(`🔍 GET ${url.pathname} - Finding course:`, courseId);
    const course = await Course.findById(courseId);
    if (!course) {
      console.log(`❌ GET ${url.pathname} - Course not found`);
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the chapter
    console.log(`🔍 GET ${url.pathname} - Finding chapter:`, chapterId);
    let foundChapter = null;
    for (const section of course.sections) {
      console.log(
        `🔍 GET ${url.pathname} - Checking section with ${section.chapters.length} chapters`
      );

      const chapter = section.chapters.find((c) => {
        const chapterId_str = c._id ? c._id.toString() : "undefined";
        console.log(
          `🔍 GET ${url.pathname} - Comparing chapter ID: ${chapterId_str} with ${chapterId}`
        );
        return c._id && c._id.toString() === chapterId;
      });

      if (chapter) {
        foundChapter = chapter;
        console.log(`✅ GET ${url.pathname} - Found chapter`);
        break;
      }
    }

    if (!foundChapter) {
      console.log(`❌ GET ${url.pathname} - Chapter not found`);
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    console.log(`🔍 GET ${url.pathname} - Found chapter stream details:`, {
      streamKey: foundChapter.streamKey || "none",
      playbackId: foundChapter.playbackId || "none",
      isLive: foundChapter.isLive || false,
    });

    if (!foundChapter.streamKey || !foundChapter.playbackId) {
      console.log(
        `❌ GET ${url.pathname} - No live stream found for this chapter`
      );
      return NextResponse.json(
        { error: "No live stream found for this chapter" },
        { status: 404 }
      );
    }

    // Verify stream details with Mux
    try {
      console.log(
        `🔍 GET ${url.pathname} - Verifying stream with Mux:`,
        foundChapter.streamKey
      );
      const stream = await mux.video.liveStreams.retrieve(
        foundChapter.streamKey
      );

      console.log(`✅ GET ${url.pathname} - Mux stream details:`, {
        id: stream.id,
        stream_key: stream.stream_key,
        playback_ids: stream.playback_ids
          ? JSON.stringify(stream.playback_ids)
          : "none",
        status: stream.status,
      });

      // Ensure we have a playback ID
      if (!stream.playback_ids || stream.playback_ids.length === 0) {
        console.log(
          `⚠️ GET ${url.pathname} - No playback IDs found, creating one`
        );
        try {
          // Create a playback ID if none exists
          const playbackIdResponse =
            await mux.video.liveStreams.createPlaybackId(stream.id, {
              policy: "public",
            });

          console.log(
            `✅ GET ${url.pathname} - Created new playback ID:`,
            playbackIdResponse
          );

          // Update the chapter with the new playback ID
          foundChapter.playbackId = playbackIdResponse.id;
          await course.save();

          console.log(
            `✅ GET ${url.pathname} - Updated chapter with new playback ID:`,
            playbackIdResponse.id
          );

          return NextResponse.json({
            streamKey: foundChapter.streamKey,
            playbackId: playbackIdResponse.id,
            isLive: foundChapter.isLive,
          });
        } catch (error) {
          console.error(
            `❌ GET ${url.pathname} - Error creating playback ID:`,
            error
          );
        }
      }

      // Update playback ID if it doesn't match
      if (
        stream.playback_ids &&
        stream.playback_ids[0]?.id &&
        stream.playback_ids[0].id !== foundChapter.playbackId
      ) {
        console.log(
          `⚠️ GET ${url.pathname} - Playback ID mismatch. Updating with correct ID from Mux`
        );
        foundChapter.playbackId = stream.playback_ids[0].id;
        await course.save();
        console.log(
          `✅ GET ${url.pathname} - Updated chapter with correct playback ID:`,
          stream.playback_ids[0].id
        );
      }

      const responsePlaybackId =
        stream.playback_ids && stream.playback_ids[0]?.id
          ? stream.playback_ids[0].id
          : foundChapter.playbackId;

      console.log(`✅ GET ${url.pathname} - Returning stream details:`, {
        streamKey: foundChapter.streamKey,
        playbackId: responsePlaybackId,
        isLive: foundChapter.isLive,
      });

      return NextResponse.json({
        streamKey: foundChapter.streamKey,
        playbackId: responsePlaybackId,
        isLive: foundChapter.isLive,
      });
    } catch (error) {
      console.error(
        `❌ GET ${url.pathname} - Error verifying stream with Mux:`,
        error
      );
      console.log(
        `⚠️ GET ${url.pathname} - Returning stored stream details as fallback`
      );

      return NextResponse.json({
        streamKey: foundChapter.streamKey,
        playbackId: foundChapter.playbackId,
        isLive: foundChapter.isLive,
      });
    }
  } catch (error) {
    console.error(
      `❌ GET ${url.pathname} - Error fetching stream details:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch stream details" },
      { status: 500 }
    );
  }
}
