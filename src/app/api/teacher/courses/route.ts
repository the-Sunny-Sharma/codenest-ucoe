import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import type { Document } from "mongodb";

// Helper function to calculate string similarity (same as main courses route)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const commonWords = [...words1].filter((word) => words2.has(word));
  if (commonWords.length > 0) {
    return 0.5 * (commonWords.length / Math.max(words1.size, words2.size));
  }

  return 0;
}

// Helper function to calculate search relevance score
function calculateRelevanceScore(course: Document, searchTerm: string): number {
  if (!searchTerm) return 0;

  let score = 0;
  const search = searchTerm.toLowerCase();

  // Title match (highest weight)
  score += calculateSimilarity(course.name, search) * 3;

  // Description match (medium weight)
  score += calculateSimilarity(course.description, search) * 2;

  // Status match (medium weight)
  if (course.status && calculateSimilarity(course.status, search) > 0.5) {
    score += 1.5;
  }

  // Category match
  if (calculateSimilarity(course.category, search) > 0.5) {
    score += 1.5;
  }

  return score;
}

export async function GET(request: Request) {
  try {
    // Check user authentication and role
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the database
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const teachersCollection = db.collection("teachers");
    const usersCollection = db.collection("users");

    //Find the user using the email and check the role
    const user = await usersCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Check if the user is a teacher
    if (user.role !== "teacher") {
      return NextResponse.json(
        { message: "Only teachers can access this endpoint" },
        { status: 403 }
      );
    }

    //Fetching the Obj ID of the teacher
    const teacher = await teachersCollection.findOne({ user: user._id });

    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    // Find the teacher using email
    // const teacher = await teachersCollection.findOne({
    //   email: session.user.email,
    // });

    // if (!teacher) {
    //   return NextResponse.json(
    //     { message: "Teacher not found" },
    //     { status: 404 }
    //   );
    // }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // console.log(`SESSion if : ${session.user.id}`);
    // // Build base query
    // const baseQuery: any = {
    //   instructor: session.user.id, // Using instructor field instead of teacherId
    // };

    // Build base query using teacher's _id
    const baseQuery: any = {
      instructor: teacher._id, // Use teacher's _id instead of session user id
    };

    // Add status filter if specified
    if (status !== "all") {
      baseQuery.status = status;
    }

    // Fetch all matching courses for search ranking
    let courses = await coursesCollection
      .find(baseQuery)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .toArray();

    // If search term exists, apply advanced search ranking
    if (search) {
      courses = courses
        .map((course) => ({
          ...course,
          relevanceScore: calculateRelevanceScore(course, search),
        }))
        .filter((course) => course.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    // Calculate pagination
    const totalCourses = courses.length;
    const startIndex = (page - 1) * limit;
    const paginatedCourses = courses.slice(startIndex, startIndex + limit);

    // Add additional course statistics
    const coursesWithStats = await Promise.all(
      paginatedCourses.map(async (course) => {
        const enrolledCount = course.enrolledStudents?.length || 0;
        const revenue = enrolledCount * course.price;

        return {
          ...course,
          stats: {
            enrolledCount,
            revenue,
            completionRate: course.completionRate || 0,
            averageRating: course.rating || 0,
          },
        };
      })
    );

    // Return response
    return NextResponse.json({
      courses: coursesWithStats,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      totalCourses,
    });
  } catch (error) {
    console.error("Error fetching teacher's courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
