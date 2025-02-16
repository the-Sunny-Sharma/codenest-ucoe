import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Course from "@/models/Course";
import Student from "@/models/Student";
import { User } from "@/models/userDetails";
import { Cashfree } from "cashfree-pg";
import { connectToDatabase } from "@/lib/connectDB";
import Payment from "@/models/Payment";

// ✅ Initialize Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_API_KEY!;
Cashfree.XClientSecret = process.env.CASHFREE_API_SECRET!;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// ✅ Function to generate a secure order ID
function generateOrderId() {
  return crypto.randomBytes(12).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Ensure DB is connected

    const { courseId, studentEmail } = await req.json();
    if (!courseId || !studentEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Find user by email
    const user = await User.findOne({ email: studentEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Find or create student record
    let student = await Student.findOne({ user: user._id });
    if (!student) {
      student = new Student({ user: user._id, enrolledCourses: [] });
      await student.save();
    }

    // ✅ Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // ✅ Generate secure order ID
    const orderId = generateOrderId();

    // ✅ Create Cashfree order request
    const paymentRequest = {
      order_amount: course.price,
      order_currency: process.env.CURRENCY || "INR", // ✅ Use env variable
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_email: studentEmail,
        customer_phone: "9999999999", // Replace with actual user phone if available
        customer_name: user.name || "Student",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/verify?order_id=${orderId}&email=${studentEmail}&courseId=${courseId}`,
      },
    };

    // ✅ Create a Cashfree payment session
    const response = await Cashfree.PGCreateOrder("2023-08-01", paymentRequest);

    if (!response.data || !response.data.payment_session_id) {
      return NextResponse.json(
        { error: "Failed to create payment session" },
        { status: 500 }
      );
    }

    // ✅ Save payment details after getting `paymentSessionId`
    const newPayment = new Payment({
      orderId,
      userId: user._id,
      studentId: student._id,
      courseId: course._id,
      studentEmail,
      amount: course.price,
      currency: process.env.CURRENCY || "INR",
      status: "pending", // ✅ Use lowercase to match schema
      paymentSessionId: response.data.payment_session_id,
      gateway: "Cashfree", // ✅ Ensure this exists in the schema
    });

    await newPayment.save();

    // ✅ Return response to the frontend
    return NextResponse.json({
      payment_session_id: response.data.payment_session_id,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: error.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}
