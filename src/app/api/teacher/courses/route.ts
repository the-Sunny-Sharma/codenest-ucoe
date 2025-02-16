// app/api/teacher/courses/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json(
        { message: "Not authenticated or not a teacher" },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    const coursesCollection = db.db.collection("courses");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";

    const query: any = { teacherId: session.user.id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const totalCourses = await coursesCollection.countDocuments(query);
    const courses = await coursesCollection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    console.log(`COURSES: ${courses}`);
    return NextResponse.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
