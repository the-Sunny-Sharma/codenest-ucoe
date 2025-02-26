import { NextResponse } from "next/server";
import { auth } from "@/auth";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const chunk = formData.get("chunk") as Blob;
    const chunkNumber = formData.get("chunkNumber");
    const totalChunks = formData.get("totalChunks");
    const fileId = formData.get("fileId");

    if (!chunk || !chunkNumber || !totalChunks || !fileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert chunk to buffer
    const buffer = Buffer.from(await chunk.arrayBuffer());

    // If this is the first chunk, start a new upload
    if (chunkNumber === "1") {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "codenest/chapter_videos",
          resource_type: "video",
          upload_preset: "codenest_chapter_videos",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return NextResponse.json(
              { error: "Upload failed" },
              { status: 500 }
            );
          }
          return NextResponse.json({
            public_id: result?.public_id,
            url: result?.secure_url,
            duration: result?.duration,
          });
        }
      );

      // Create readable stream from buffer and pipe to Cloudinary
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);

      return NextResponse.json({ success: true, chunkNumber });
    }

    // For subsequent chunks, append to existing upload
    // Note: This is a simplified version. In production, you'd want to handle
    // chunk assembly and verification more robustly

    return NextResponse.json({ success: true, chunkNumber });
  } catch (error) {
    console.error("Chunk upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
