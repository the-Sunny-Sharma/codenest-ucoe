import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

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
    console.log("🔔 Cloudinary notification received");

    // Get headers and request body
    const headersList = headers();
    const signature = headersList.get("x-cld-signature");
    const timestamp = headersList.get("x-cld-timestamp");
    const body = await request.json();

    console.log("📜 Notification body:", JSON.stringify(body, null, 2));

    if (!signature || !timestamp) {
      console.warn("⚠️ Missing Cloudinary signature headers");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Cloudinary signature
    const isValid =
      cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET
      ) === signature;

    if (!isValid) {
      console.warn("❌ Invalid Cloudinary signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Valid Cloudinary signature");

    // Handle the notification (store in DB, trigger events, etc.)
    if (body.eager && body.eager.length > 0) {
      console.log("📺 Transcoded video URL:", body.eager[0].secure_url);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error handling Cloudinary notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
