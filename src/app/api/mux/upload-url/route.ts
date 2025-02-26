import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function POST() {
  try {
    console.log("Received request to generate Mux upload URL.");

    const response = await fetch("https://api.mux.com/video/v1/uploads", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.MUX_ACCESS_KEY}:${process.env.MUX_SECRET_KEY}`
          ).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cors_origin: "*", // Allow uploads from any origin
        new_asset_settings: { playback_policy: ["public"] },
      }),
    });

    if (!response.ok) {
      console.error("Mux API Error:", await response.text());
      throw new Error("Failed to get Mux upload URL");
    }

    const data = await response.json();
    console.log("Mux Upload URL generated successfully:", data);

    return NextResponse.json({
      uploadUrl: data.data.url, // URL to upload the video
      uploadId: data.data.id, // This is the Upload ID (not the Asset ID)
    });
  } catch (error) {
    console.error("Mux Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
