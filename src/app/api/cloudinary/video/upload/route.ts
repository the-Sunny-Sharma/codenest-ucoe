import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary environment variables");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Backend Validation for 100MB Limit
    const MAX_FILE_SIZE = 104857600; // 100MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    console.log(
      `📤 Uploading ${file.name} (${file.size} bytes) to Cloudinary...`
    );

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "course-videos",
      resource_type: "video",
      eager: [{ streaming_profile: "full_hd", format: "m3u8" }],
      eager_async: true,
      eager_notification_url: `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/video/notify`,
    });

    console.log(`✅ Upload complete: ${result.secure_url}`);

    return NextResponse.json({
      url: result.secure_url,
      playbackUrl: result.secure_url.replace(/\.[^/.]+$/, "/playlist.m3u8"),
      duration: Math.round(result.duration || 0),
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Error uploading video:", error);
    return NextResponse.json(
      { error: "Error uploading video" },
      { status: 500 }
    );
  }
}
