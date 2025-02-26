import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    console.log("MUX playback id");

    const { assetId } = await req.json();
    if (!assetId) throw new Error("Missing assetId in request body");

    console.log("Fetching playback ID for asset:", assetId);

    // Poll Mux for playback ID (up to 10 retries)
    let playbackId = null;
    for (let i = 0; i < 10; i++) {
      console.log(`Attempt ${i + 1}: Requesting playback ID from Mux...`);

      const response = await fetch(
        `https://api.mux.com/video/v1/assets/${assetId}`,
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${process.env.MUX_ACCESS_KEY}:${process.env.MUX_SECRET_KEY}`
              ).toString("base64"),
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Mux Playback API Error:", errorText);
        throw new Error("Failed to fetch playback ID");
      }

      const data = await response.json();
      playbackId = data.data?.playback_ids?.[0]?.id;

      if (playbackId) {
        console.log("Playback ID retrieved successfully:", playbackId);
        return NextResponse.json({ playbackId });
      }

      console.log("Mux is still processing... Retrying in 5s.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.error("Mux processing took too long. No playback ID available.");
    return NextResponse.json(
      { error: "Playback ID not available yet" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Mux Playback ID Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve playback ID" },
      { status: 500 }
    );
  }
}
