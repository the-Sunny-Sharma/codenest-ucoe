import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import NodeCache from "node-cache";
import Course from "@/models/Course"; // Mongoose model

const cache = new NodeCache({ stdTTL: 300, checkperiod: 600 }); // Cache for 5 mins

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure DB is connected

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    if (!q) {
      return NextResponse.json(
        { message: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedResults = cache.get(q);
    if (cachedResults) return NextResponse.json(cachedResults);

    // Search courses by title or tags
    const regex = new RegExp(q, "i");
    const courses = await Course.find({
      $or: [{ title: regex }, { tags: regex }],
    })
      .select(
        "_id name instructor tags thumbnail rating numberOfReviews price level"
      )
      .populate("instructor", "name") // Fetches only the instructor's name
      .lean(); // Optimizes query by returning plain objects

    console.log(courses);
    // Extract unique tags from matching courses
    const uniqueTags = [
      ...new Set(courses.flatMap((course) => course.tags)),
    ].filter((tag) => tag.toLowerCase().includes(q));

    // Transform response to remove `_id`
    const response = {
      suggestions: uniqueTags,
      courses: courses.map((course) => ({
        ...course,
        id: course._id, // Rename `_id` to `id`
      })),
    };

    // Save in cache
    cache.set(q, response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
