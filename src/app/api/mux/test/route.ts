import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function GET(request: Request) {
  console.log("🔍 GET /api/mux/test - Testing Mux API connection");

  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.log("❌ GET /api/mux/test - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test Mux API connection
    console.log("🔍 GET /api/mux/test - Listing live streams");
    const streams = await mux.video.liveStreams.list();

    console.log("✅ GET /api/mux/test - Successfully listed live streams:", {
      count: streams.length,
      streams: streams.map((s) => ({
        id: s.id,
        status: s.status,
        playback_ids: s.playback_ids ? s.playback_ids.map((p) => p.id) : "none",
      })),
    });

    // Create a test stream
    console.log("🔍 GET /api/mux/test - Creating test live stream");
    const testStream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      new_asset_settings: { playback_policy: ["public"] },
    });

    console.log("✅ GET /api/mux/test - Created test stream:", {
      id: testStream.id,
      stream_key: testStream.stream_key,
      playback_ids: testStream.playback_ids
        ? testStream.playback_ids.map((p) => p.id)
        : "none",
      status: testStream.status,
    });

    // Create a playback ID if none exists
    if (!testStream.playback_ids || testStream.playback_ids.length === 0) {
      console.log(
        "🔍 GET /api/mux/test - Creating playback ID for test stream"
      );
      const playbackIdResponse = await mux.video.liveStreams.createPlaybackId(
        testStream.id,
        { policy: "public" }
      );

      console.log(
        "✅ GET /api/mux/test - Created playback ID:",
        playbackIdResponse
      );

      // Refresh stream data to get the new playback ID
      console.log("🔍 GET /api/mux/test - Retrieving updated test stream");
      const updatedStream = await mux.video.liveStreams.retrieve(testStream.id);

      console.log("✅ GET /api/mux/test - Updated test stream:", {
        id: updatedStream.id,
        stream_key: updatedStream.stream_key,
        playback_ids: updatedStream.playback_ids
          ? updatedStream.playback_ids.map((p) => p.id)
          : "none",
        status: updatedStream.status,
      });

      return NextResponse.json({
        success: true,
        message: "Mux API connection successful",
        streamCount: streams.length,
        testStream: {
          id: updatedStream.id,
          stream_key: updatedStream.stream_key,
          playback_ids: updatedStream.playback_ids,
          status: updatedStream.status,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Mux API connection successful",
      streamCount: streams.length,
      testStream: {
        id: testStream.id,
        stream_key: testStream.stream_key,
        playback_ids: testStream.playback_ids,
        status: testStream.status,
      },
    });
  } catch (error) {
    console.error("❌ GET /api/mux/test - Error testing Mux API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to test Mux API connection",
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
