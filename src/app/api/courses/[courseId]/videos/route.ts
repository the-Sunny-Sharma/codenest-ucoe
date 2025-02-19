import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectToDatabase();
    const { title, assetId } = await req.json();

    console.log(
      `Course id: ${params.courseId} Title: ${title} AssetId:${assetId}`
    );

    const course = await Course.findById(params.courseId);
    console.log(`Course: ${course}`);
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    course.chapters.push({
      title,
      videoUrls: [`https://stream.mux.com/${assetId}.m3u8`],
    });
    await course.save();

    return NextResponse.json({ message: "Video added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 });
  }
}
