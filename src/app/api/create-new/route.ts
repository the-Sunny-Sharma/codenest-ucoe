import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import { generateSlug } from "@/lib/utils";
import { nanoid } from "nanoid";
// import mongoose from "mongoose";
import { User } from "@/models/userDetails";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();

    const userEmail = session.user.email;
    const userDetails = await User.findOne({ email: userEmail });

    if (!userDetails || userDetails.role !== "teacher") {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    const teacher = await Teacher.findOne({ user: userDetails._id });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher record not found" },
        { status: 404 }
      );
    }

    const data = await req.json();

    if (!data.name || typeof data.name !== "string") {
      return NextResponse.json(
        { error: "Course name is required and must be a string" },
        { status: 400 }
      );
    }

    const slug = await generateSlug(data.name);
    // const instructorObjectId = new mongoose.Types.ObjectId(userDetails._id);

    const newCourse = new Course({
      ...data,
      slug,
      instructor: teacher._id, // ✅ Directly assign teacher._id
      // instructor: instructorObjectId,
      instructorName: userDetails.name,
      enrolledStudents: [],
      classCode: nanoid(8).toUpperCase(),
      totalHours: 0,
      status: "draft",
    });

    await newCourse.save();

    // Update the teacher's courses array
    teacher.courses.push(newCourse._id);
    await teacher.save();

    return NextResponse.json({ success: true, slug: newCourse.slug });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
