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
  console.log(`🔍 GET ${url.pathname}${url.search} - Fetching recorded asset`);

  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log(`❌ GET ${url.pathname} - Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = url;
    const courseId = searchParams.get("courseId");
    const chapterId = searchParams.get("chapterId");

    if (!courseId || !chapterId) {
      console.log(`❌ GET ${url.pathname} - Missing required fields`);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the chapter
    let foundChapter = null;
    let sectionIndex = -1;
    let chapterIndex = -1;

    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];
      const cIndex = section.chapters.findIndex(
        (c) => c._id && c._id.toString() === chapterId
      );

      if (cIndex !== -1) {
        foundChapter = section.chapters[cIndex];
        sectionIndex = i;
        chapterIndex = cIndex;
        break;
      }
    }

    if (!foundChapter || !foundChapter.muxStreamId) {
      return NextResponse.json(
        { error: "Chapter not found or no stream ID" },
        { status: 404 }
      );
    }

    // Check if we already have the asset ID stored
    if (foundChapter.muxAssetId && foundChapter.muxPlaybackId) {
      console.log(`✅ GET ${url.pathname} - Using stored asset information`);
      return NextResponse.json({
        assetId: foundChapter.muxAssetId,
        playbackId: foundChapter.muxPlaybackId,
        success: true,
      });
    }

    // Get the live stream to check for recent assets
    const stream = await mux.video.liveStreams.retrieve(
      foundChapter.muxStreamId
    );

    // Check if there are any recent assets (recordings)
    if (!stream.recent_asset_ids || stream.recent_asset_ids.length === 0) {
      console.log(`❌ GET ${url.pathname} - No recorded assets found`);
      return NextResponse.json(
        { error: "No recorded assets found for this stream" },
        { status: 404 }
      );
    }

    // Get the most recent asset (recording)
    const assetId = stream.recent_asset_ids[0];
    console.log(`✅ GET ${url.pathname} - Found asset ID: ${assetId}`);

    // Get the asset details to retrieve the playback ID
    const asset = await mux.video.assets.retrieve(assetId);

    if (!asset.playback_ids || asset.playback_ids.length === 0) {
      // Create a playback ID if none exists
      const playbackIdResponse = await mux.video.assets.createPlaybackId(
        assetId,
        { policy: "public" }
      );

      // Update the chapter with the asset and playback information
      course.sections[sectionIndex].chapters[chapterIndex].muxAssetId = assetId;
      course.sections[sectionIndex].chapters[chapterIndex].muxPlaybackId =
        playbackIdResponse.id;

      await course.save();

      return NextResponse.json({
        assetId,
        playbackId: playbackIdResponse.id,
        success: true,
      });
    }

    // Use existing playback ID
    const playbackId = asset.playback_ids[0].id;

    // Update the chapter with the asset and playback information
    course.sections[sectionIndex].chapters[chapterIndex].muxAssetId = assetId;
    course.sections[sectionIndex].chapters[chapterIndex].muxPlaybackId =
      playbackId;

    await course.save();

    return NextResponse.json({
      assetId,
      playbackId,
      success: true,
    });
  } catch (error) {
    console.error(`❌ GET ${url.pathname} - Error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch recorded asset" },
      { status: 500 }
    );
  }
}
