import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import Payment from "@/models/Payment";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { Cashfree } from "cashfree-pg";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { orderId, email, courseId } = await req.json();

    if (!orderId || !email || !courseId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`Verifying payment for order: ${orderId}`);

    // Find the payment record first
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    try {
      // Verify payment status with Cashfree
      Cashfree.XClientId = process.env.CASHFREE_API_KEY!;
      Cashfree.XClientSecret = process.env.CASHFREE_API_SECRET!;
      Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

      const response = await Cashfree.PGOrderFetchPayments(
        "2023-08-01",
        orderId
      );
      const paymentData = response.data;

      if (!paymentData || paymentData.length === 0) {
        return NextResponse.json(
          { error: "Payment data not found" },
          { status: 404 }
        );
      }

      const lastPayment = paymentData[paymentData.length - 1];

      if (lastPayment.payment_status === "SUCCESS") {
        // Update payment status
        payment.status = "successful";
        payment.transactionId = lastPayment.cf_payment_id;
        payment.paymentMethod = JSON.stringify(lastPayment.payment_method);
        await payment.save();

        // Enroll student in course
        await Student.findOneAndUpdate(
          { user: payment.userId },
          { $addToSet: { enrolledCourses: payment.courseId } }
        );

        // Update course enrolled students
        const course = await Course.findByIdAndUpdate(
          payment.courseId,
          { $addToSet: { enrolledStudents: payment.userId } },
          { new: true }
        ).populate("instructor");

        if (!course) {
          return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
          );
        }

        // Send confirmation email
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: email,
              subject: "Course Enrollment Confirmation",
              courseDetails: {
                id: course._id,
                name: course.name,
                instructor: course.instructor.name,
                duration: course.totalHours,
              },
              paymentDetails: {
                orderId: payment.orderId,
                amount: payment.amount,
                status: "Successful",
                transactionId: payment.transactionId,
              },
            }),
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Continue with enrollment even if email fails
        }

        return NextResponse.json({
          success: true,
          message: "Payment verified and enrollment completed",
          courseId: course._id,
          slug: course.slug,
          paymentDetails: {
            orderId: payment.orderId,
            amount: payment.amount,
            status: "Successful",
            transactionId: payment.transactionId,
            paymentMethod: payment.paymentMethod,
            date: payment.updatedAt,
          },
        });
      } else {
        payment.status = "failed";
        await payment.save();

        return NextResponse.json(
          {
            error: "Payment verification failed",
            reason: lastPayment.payment_status,
            orderId: payment.orderId,
          },
          { status: 400 }
        );
      }
    } catch (cashfreeError: any) {
      console.error("Cashfree API error:", cashfreeError);

      // For development/testing purposes - simulate successful payment
      if (
        process.env.NODE_ENV === "development" &&
        process.env.MOCK_PAYMENTS === "true"
      ) {
        console.log("Using mock payment verification in development mode");

        // Update payment status
        payment.status = "successful";
        payment.transactionId = `mock-${Date.now()}`;
        payment.paymentMethod = "mock-payment";
        await payment.save();

        // Enroll student in course
        await Student.findOneAndUpdate(
          { user: payment.userId },
          { $addToSet: { enrolledCourses: payment.courseId } }
        );

        // Update course enrolled students
        const course = await Course.findByIdAndUpdate(
          payment.courseId,
          { $addToSet: { enrolledStudents: payment.userId } },
          { new: true }
        ).populate("instructor");

        if (!course) {
          return NextResponse.json(
            { error: "Course not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Mock payment verification successful",
          courseId: course._id,
          slug: course.slug,
          paymentDetails: {
            orderId: payment.orderId,
            amount: payment.amount,
            status: "Successful (Mock)",
            transactionId: payment.transactionId,
            paymentMethod: "Mock Payment",
            date: payment.updatedAt,
          },
          isMock: true,
        });
      }

      // If not in development mode or mock payments not enabled, return the error
      return NextResponse.json(
        {
          error: "Payment gateway authentication failed",
          details: cashfreeError.message,
          orderId: payment.orderId,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
