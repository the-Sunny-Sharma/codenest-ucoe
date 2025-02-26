import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const { sections } = await request.json();

    await connectToDatabase();
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    course.sections = sections.map((section: any, index: number) => ({
      ...section,
      order: index + 1,
    }));

    await course.save();

    return NextResponse.json({
      message: "Sections reordered successfully",
      sections: course.sections,
    });
  } catch (error) {
    console.error("Error reordering sections:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
