import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { User } from "@/models/userDetails";
import Teacher from "@/models/Teacher";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user?.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "teacher") {
      return NextResponse.json(
        { success: false, error: "User is not a teacher" },
        { status: 403 }
      );
    }

    const teacher = await Teacher.findOne({ user: user._id });

    if (!teacher) {
      return NextResponse.json(
        { success: false, error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, status: "registered" });
  } catch (error) {
    console.error("Error checking teacher status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
