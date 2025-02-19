import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import type { Document } from "mongodb";

// Helper function to calculate string similarity
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Calculate exact matches
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;

  // Calculate word matches
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

  // Tags match (lower weight)
  if (Array.isArray(course.tags)) {
    const tagMatches = course.tags.some(
      (tag) => calculateSimilarity(tag.toString(), search) > 0.5
    );
    if (tagMatches) score += 1;
  }

  // Category match
  if (calculateSimilarity(course.category, search) > 0.5) {
    score += 1.5;
  }

  return score;
}

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
    const coursesCollection = db.collection("courses");

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const level = searchParams.get("level") || "all";

    // Build base query
    const baseQuery: any = {};
    if (category !== "all") {
      baseQuery.category = category;
    }
    if (level !== "all") {
      baseQuery.level = level;
    }

    // Fetch all matching courses for search ranking
    let courses = await coursesCollection.find(baseQuery).toArray();

    // If search term exists, apply advanced search ranking
    if (search) {
      // Calculate relevance scores
      courses = courses
        .map((course) => ({
          ...course,
          relevanceScore: calculateRelevanceScore(course, search),
        }))
        .filter((course) => course.relevanceScore > 0) // Only keep relevant results
        .sort((a, b) => b.relevanceScore - a.relevanceScore); // Sort by relevance
    }

    // Calculate pagination
    const totalCourses = courses.length;
    const startIndex = (page - 1) * limit;
    const paginatedCourses = courses.slice(startIndex, startIndex + limit);

    // Return response
    return NextResponse.json({
      courses: paginatedCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      totalCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { connectToDatabase } from "@/lib/connectDB";

// export async function GET(request: Request) {
//   try {
//     // Check user authentication
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json(
//         { message: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     // Connect to the database
//     const db = await connectToDatabase();
//     const coursesCollection = db.collection("courses"); // ✅ Ensure correct access

//     // Parse query parameters
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "12", 10);
//     const search = searchParams.get("search") || "";
//     const category = searchParams.get("category") || "all";
//     const level = searchParams.get("level") || "all";

//     // Build query conditions
//     const query: any = {};
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { description: { $regex: search, $options: "i" } },
//       ];
//     }
//     if (category !== "all") {
//       query.category = category;
//     }
//     if (level !== "all") {
//       query.level = level;
//     }

//     // Fetch courses and count total
//     const totalCourses = await coursesCollection.countDocuments(query);
//     const courses = await coursesCollection
//       .find(query)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .toArray();

//     // Debug API response
//     console.log("API Response:", {
//       courses,
//       totalPages: Math.ceil(totalCourses / limit),
//       currentPage: page,
//     });

//     // Return response
//     return NextResponse.json({
//       courses: Array.isArray(courses) ? courses : [], // ✅ Ensure array
//       totalPages: Math.ceil(totalCourses / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
