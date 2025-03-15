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
  console.log(
    "🔍 POST /api/mux/create-playback-id - Starting to create playback ID"
  );
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ POST /api/mux/create-playback-id - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterId, streamId } = await request.json();
    console.log("🔍 POST /api/mux/create-playback-id - Request params:", {
      courseId,
      chapterId,
      streamId,
    });

    if (!courseId || !chapterId || !streamId) {
      console.log(
        "❌ POST /api/mux/create-playback-id - Missing required fields"
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new playback ID for the stream
    console.log(
      "🔍 POST /api/mux/create-playback-id - Creating playback ID for stream:",
      streamId
    );
    const playbackIdResponse = await mux.video.liveStreams.createPlaybackId(
      streamId,
      { policy: "public" }
    );

    console.log(
      "✅ POST /api/mux/create-playback-id - Created new playback ID:",
      playbackIdResponse
    );

    // Update the chapter with the new playback ID
    await connectToDatabase();
    console.log(
      "🔍 POST /api/mux/create-playback-id - Finding course:",
      courseId
    );
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("❌ POST /api/mux/create-playback-id - Course not found");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the chapter
    console.log(
      "🔍 POST /api/mux/create-playback-id - Finding chapter:",
      chapterId
    );
    let foundChapter = null;
    let sectionIndex = -1;
    let chapterIndex = -1;

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];
      console.log(
        `🔍 POST /api/mux/create-playback-id - Checking section ${i}, with ${section.chapters.length} chapters`
      );

      const cIndex = section.chapters.findIndex((c) => {
        const chapterId_str = c._id ? c._id.toString() : "undefined";
        console.log(
          `🔍 POST /api/mux/create-playback-id - Comparing chapter ID: ${chapterId_str} with ${chapterId}`
        );
        return c._id && c._id.toString() === chapterId;
      });

      if (cIndex !== -1) {
        foundChapter = section.chapters[cIndex];
        sectionIndex = i;
        chapterIndex = cIndex;
        console.log(
          `✅ POST /api/mux/create-playback-id - Found chapter at section ${i}, index ${cIndex}`
        );
        break;
      }
    }

    if (!foundChapter) {
      console.log("❌ POST /api/mux/create-playback-id - Chapter not found");
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Update the playback ID
    console.log(
      "🔍 POST /api/mux/create-playback-id - Updating chapter with new playback ID:",
      playbackIdResponse.id
    );
    course.sections[sectionIndex].chapters[chapterIndex].playbackId =
      playbackIdResponse.id;
    await course.save();
    console.log(
      "✅ POST /api/mux/create-playback-id - Saved updated playback ID"
    );

    return NextResponse.json({
      playbackId: playbackIdResponse.id,
      success: true,
    });
  } catch (error) {
    console.error(
      "❌ POST /api/mux/create-playback-id - Error creating playback ID:",
      error
    );
    return NextResponse.json(
      { error: "Failed to create playback ID" },
      { status: 500 }
    );
  }
}
