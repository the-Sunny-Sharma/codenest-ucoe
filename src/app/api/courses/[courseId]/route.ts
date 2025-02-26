import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import { User } from "@/models/userDetails";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { courseId } = params;
    const updatedCourseData = await request.json();

    // Get the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get the instructor's teacher record
    const teacher = await Teacher.findById(course.instructor);
    if (!teacher) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Get the user associated with the teacher
    const user = await User.findById(teacher.user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the authenticated user's email with the instructor's email
    if (user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update course details
    Object.assign(course, updatedCourseData);
    await course.save();

    return NextResponse.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { courseId } = params;

    // Get the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get the instructor's teacher record
    const teacher = await Teacher.findById(course.instructor);
    if (!teacher) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Get the user associated with the teacher
    const user = await User.findById(teacher.user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the authenticated user's email with the instructor's email
    if (user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await Course.findByIdAndDelete(courseId);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
