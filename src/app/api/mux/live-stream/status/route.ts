import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Mux from "@mux/mux-node";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  console.log(
    `🔍 GET ${url.pathname}${url.search} - Starting to check stream status`
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

    // Find the section and chapter
    console.log(`🔍 GET ${url.pathname} - Finding chapter:`, chapterId);
    let foundChapter = null;
    let sectionIndex = -1;
    let chapterIndex = -1;

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];
      console.log(
        `🔍 GET ${url.pathname} - Checking section ${i}, with ${section.chapters.length} chapters`
      );

      const cIndex = section.chapters.findIndex((c) => {
        const chapterId_str = c._id ? c._id.toString() : "undefined";
        console.log(
          `🔍 GET ${url.pathname} - Comparing chapter ID: ${chapterId_str} with ${chapterId}`
        );
        return c._id && c._id.toString() === chapterId;
      });

      if (cIndex !== -1) {
        foundChapter = section.chapters[cIndex];
        sectionIndex = i;
        chapterIndex = cIndex;
        console.log(
          `✅ GET ${url.pathname} - Found chapter at section ${i}, index ${cIndex}`
        );
        break;
      }
    }

    if (!foundChapter || !foundChapter.streamKey) {
      console.log(
        `❌ GET ${url.pathname} - Chapter not found or no stream key`
      );
      return NextResponse.json({ isLive: false });
    }

    console.log(`🔍 GET ${url.pathname} - Checking status for stream:`, {
      streamKey: foundChapter.streamKey,
      playbackId: foundChapter.playbackId || "none",
    });

    try {
      // Get live stream status from Mux
      console.log(
        `🔍 GET ${url.pathname} - Retrieving stream from Mux:`,
        foundChapter.streamKey
      );
      const stream = await mux.video.liveStreams.retrieve(
        foundChapter.muxStreamId
      );

      console.log(`✅ GET ${url.pathname} - Mux stream status:`, {
        id: stream.id,
        status: stream.status,
        active: stream.status === "active",
        playback_ids: stream.playback_ids
          ? JSON.stringify(stream.playback_ids)
          : "none",
      });

      // If the stream is not active (ended), we need to get the recorded asset's playback ID
      if (stream.status != "active") {
        // Get the most recent asset
        if (stream.recent_asset_ids && stream.recent_asset_ids.length > 0) {
          const assetId = stream.recent_asset_ids[0];
          const asset = await mux.video.assets.retrieve(assetId);

          // Use the recorded asset's playback ID
          if (asset.playback_ids && asset.playback_ids.length > 0) {
            return NextResponse.json({
              isLive: false,
              playbackId: asset.playback_ids[0].id,
            });
          }
        }
      }

      const isLive = stream.status === "active";

      // Ensure we have a playback ID
      let playbackId = foundChapter.playbackId;

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
          playbackId = playbackIdResponse.id;

          // Update the chapter with the new playback ID
          course.sections[sectionIndex].chapters[chapterIndex].playbackId =
            playbackId;
          console.log(
            `✅ GET ${url.pathname} - Updated chapter with new playback ID:`,
            playbackId
          );
        } catch (error) {
          console.error(
            `❌ GET ${url.pathname} - Error creating playback ID:`,
            error
          );
        }
      } else if (
        stream.playback_ids[0]?.id &&
        stream.playback_ids[0].id !== foundChapter.playbackId
      ) {
        // Update playback ID if it doesn't match
        console.log(`⚠️ GET ${url.pathname} - Updating mismatched playback ID`);
        playbackId = stream.playback_ids[0].id;
        course.sections[sectionIndex].chapters[chapterIndex].playbackId =
          playbackId;
        console.log(
          `✅ GET ${url.pathname} - Updated chapter with correct playback ID:`,
          playbackId
        );
      }

      // Update chapter status if it has changed
      if (
        foundChapter.isLive !== isLive ||
        foundChapter.playbackId !== playbackId
      ) {
        console.log(
          `⚠️ GET ${url.pathname} - Updating stream status from ${foundChapter.isLive} to ${isLive}`
        );
        course.sections[sectionIndex].chapters[chapterIndex].isLive = isLive;
        await course.save();
        console.log(
          `✅ GET ${url.pathname} - Saved updated stream status and playback ID`
        );
      }

      console.log(`✅ GET ${url.pathname} - Returning stream status:`, {
        isLive,
        playbackId,
      });

      return NextResponse.json({
        isLive,
        playbackId,
      });
    } catch (error) {
      console.error(
        `❌ GET ${url.pathname} - Error checking Mux stream status:`,
        error
      );
      return NextResponse.json({ isLive: false });
    }
  } catch (error) {
    console.error(
      `❌ GET ${url.pathname} - Error checking live stream status:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to check live stream status" },
      { status: 500 }
    );
  }
}
