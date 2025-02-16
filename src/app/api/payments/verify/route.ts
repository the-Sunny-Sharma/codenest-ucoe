import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Course from "@/models/Course";
import Student from "@/models/Student";
import { User } from "@/models/userDetails";
import Payment from "@/models/Payment";
import { Cashfree } from "cashfree-pg";
import { connectToDatabase } from "@/lib/connectDB";

// ✅ Initialize Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_API_KEY!;
Cashfree.XClientSecret = process.env.CASHFREE_API_SECRET!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export async function POST(req: Request) {
  try {
    const { orderId, email, courseId } = await req.json();

    if (!orderId || !email || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    console.log(`Verifying payment for order: ${orderId}`);

    await connectToDatabase(); // ✅ Use centralized DB connection

    // ✅ Find the payment record
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      );
    }

    // ✅ Verify payment with Cashfree before marking as successful
    const verifyResponse = await Cashfree.PGFetchOrder("2023-08-01", orderId);

    if (!verifyResponse || verifyResponse.data.order_status !== "PAID") {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // ✅ Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Find or create the Student record
    let student = await Student.findOne({ user: user._id });
    if (!student) {
      student = new Student({ user: user._id, enrolledCourses: [] });
      await student.save();
    }

    // ✅ Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // ✅ Check if the student is already enrolled
    if (
      student.enrolledCourses
        .map((id) => id.toString())
        .includes(course._id.toString())
    ) {
      return NextResponse.json(
        { success: false, message: "Already enrolled" },
        { status: 400 }
      );
    }

    // ✅ Add student to the course
    course.enrolledStudents.push(user._id);
    await course.save();

    // ✅ Add course to student's enrolled courses
    student.enrolledCourses.push(course._id);
    await student.save();

    // ✅ Update payment status to "successful"
    payment.status = "successful";
    await payment.save();

    return NextResponse.json({
      success: true,
      message: "Enrollment successful",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
