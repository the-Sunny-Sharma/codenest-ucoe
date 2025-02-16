import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET(request: Request) {
  try {
    // Check user authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the database
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses"); // ✅ Ensure correct access

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const level = searchParams.get("level") || "all";

    // Build query conditions
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category !== "all") {
      query.category = category;
    }
    if (level !== "all") {
      query.level = level;
    }

    // Fetch courses and count total
    const totalCourses = await coursesCollection.countDocuments(query);
    const courses = await coursesCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Debug API response
    console.log("API Response:", {
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });

    // Return response
    return NextResponse.json({
      courses: Array.isArray(courses) ? courses : [], // ✅ Ensure array
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
