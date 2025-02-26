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

    // Calculate total hours from all sections and chapters
    const totalHours =
      sections.reduce((total: number, section: any) => {
        return (
          total +
          section.chapters.reduce((sectionTotal: number, chapter: any) => {
            return sectionTotal + (chapter.duration || 0);
          }, 0)
        );
      }, 0) / 60; // Convert minutes to hours

    course.sections = sections;
    course.totalHours = Math.round(totalHours * 100) / 100; // Round to 2 decimal places

    await course.save();

    return NextResponse.json({
      message: "Sections updated successfully",
      sections: course.sections,
    });
  } catch (error) {
    console.error("Error updating sections:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
