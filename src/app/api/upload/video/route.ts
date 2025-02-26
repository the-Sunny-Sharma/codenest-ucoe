import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_ACCESS_KEY!,
  tokenSecret: process.env.MUX_SECRET_KEY!,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a direct upload URL
    const upload = await mux.video.uploads.create({
      new_asset_settings: { playback_policy: "public" },
      cors_origin: "*",
    });

    return NextResponse.json({
      uploadUrl: upload.url,
      assetId: upload.asset_id,
    });
  } catch (error) {
    console.error("Error creating upload:", error);
    return NextResponse.json(
      { error: "Error creating upload" },
      { status: 500 }
    );
  }
}
