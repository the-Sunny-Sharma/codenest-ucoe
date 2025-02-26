import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string; sectionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, sectionId } = params;
    const { chapters } = await request.json();

    await connectToDatabase();
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sectionIndex = course.sections.findIndex(
      (section: any) => section._id.toString() === sectionId
    );

    if (sectionIndex === -1) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    course.sections[sectionIndex].chapters = chapters.map(
      (chapter: any, index: number) => ({
        ...chapter,
        order: index + 1,
      })
    );

    // Recalculate section totals
    course.sections[sectionIndex].totalChapters = chapters.length;
    course.sections[sectionIndex].totalDuration = chapters.reduce(
      (total: number, chapter: any) => total + (chapter.duration || 0),
      0
    );

    // Recalculate course total hours
    course.totalHours =
      course.sections.reduce((total: number, section: any) => {
        return (
          total +
          section.chapters.reduce((sectionTotal: number, chapter: any) => {
            return sectionTotal + (chapter.duration || 0);
          }, 0)
        );
      }, 0) / 60;

    await course.save();

    return NextResponse.json({
      message: "Chapters reordered successfully",
      chapters: course.sections[sectionIndex].chapters,
    });
  } catch (error) {
    console.error("Error reordering chapters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
