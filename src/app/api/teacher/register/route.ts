import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/models/userDetails";
import Teacher from "@/models/Teacher";
import { connectToDatabase } from "@/lib/connectDB";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { title, qualifications, expertise, bio } = await request.json();

    const teacher = new Teacher({
      user: user._id,
      title,
      qualifications,
      expertise,
      bio,
    });

    await teacher.save();

    // Update user role to teacher
    await User.findByIdAndUpdate(user._id, { role: "teacher" });

    return NextResponse.json(
      { message: "Teacher registered successfully", teacher },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering teacher:", error);
    return NextResponse.json(
      { message: "Error registering teacher" },
      { status: 500 }
    );
  }
}
