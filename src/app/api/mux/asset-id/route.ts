import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req: Request) {
  try {
    const { uploadId } = await req.json();
    if (!uploadId) throw new Error("Missing uploadId in request body");

    console.log("Fetching Asset ID for upload:", uploadId);

    // Poll Mux for the Asset ID (10 retries, 5s intervals)
    let assetId = null;
    for (let i = 0; i < 10; i++) {
      console.log(`Attempt ${i + 1}: Checking Mux asset status...`);

      const response = await fetch(
        `https://api.mux.com/video/v1/uploads/${uploadId}`,
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
        console.error("Mux Asset API Error:", await response.text());
        throw new Error("Failed to fetch asset ID");
      }

      const data = await response.json();
      assetId = data.data?.asset_id;

      if (assetId) {
        console.log("Asset ID retrieved successfully:", assetId);
        return NextResponse.json({ assetId });
      }

      console.log("Mux is still processing... Retrying in 5s.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.error("Mux processing took too long. No Asset ID available.");
    return NextResponse.json(
      { error: "Asset ID not available yet" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Mux Asset ID Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve asset ID" },
      { status: 500 }
    );
  }
}
