// // import { NextResponse } from "next/server";
// // import { Resend } from "resend";

// // // Initialize Resend with API key
// // const resend = new Resend(process.env.RESEND_API_KEY);

// // export async function POST(request: Request) {
// //   try {
// //     const { to, subject, courseDetails, paymentDetails } = await request.json();

// //     if (!to || !subject || !courseDetails || !paymentDetails) {
// //       return NextResponse.json(
// //         { error: "Missing required fields" },
// //         { status: 400 }
// //       );
// //     }

// //     const { data, error } = await resend.emails.send({
// //       // from: "CodeNest <notifications@codenest.com>",
// //       from: "onboarding@resend.dev", // ✅ No domain verification needed
// //       to: [to],
// //       subject: subject,
// //       html: `
// //         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
// //           <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
// //             <h1 style="margin: 0;">Course Enrollment Confirmation</h1>
// //           </div>

// //           <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
// //             <p>Thank you for enrolling in our course! Your payment has been successfully processed.</p>

// //             <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
// //               <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Course Details</h2>
// //               <p><strong>Course:</strong> ${courseDetails.name}</p>
// //               <p><strong>Instructor:</strong> ${courseDetails.instructor}</p>
// //               <p><strong>Duration:</strong> ${courseDetails.duration} hours</p>
// //             </div>

// //             <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
// //               <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Payment Details</h2>
// //               <p><strong>Order ID:</strong> ${paymentDetails.orderId}</p>
// //               <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</p>
// //               <p><strong>Payment Status:</strong> ${paymentDetails.status}</p>
// //               <p><strong>Transaction ID:</strong> ${
// //                 paymentDetails.transactionId
// //               }</p>
// //               <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
// //             </div>

// //             <div style="margin-top: 30px; text-align: center;">
// //               <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
// //         courseDetails.id
// //       }"
// //                  style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px;
// //                         text-decoration: none; border-radius: 6px; font-weight: bold;">
// //                 Start Learning
// //               </a>
// //             </div>

// //             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
// //               <p style="color: #64748b; font-size: 14px;">
// //                 If you have any questions, please contact our support team at support@codenest.com
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       `,
// //     });

// //     if (error) {
// //       console.error("Email sending error:", error);
// //       return NextResponse.json({ error: error.message }, { status: 500 });
// //     }

// //     return NextResponse.json({ success: true, messageId: data?.id });
// //   } catch (error: any) {
// //     console.error("Failed to send email:", error);
// //     return NextResponse.json(
// //       { error: error.message || "Failed to send email" },
// //       { status: 500 }
// //     );
// //   }
// // }
// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// // Initialize Nodemailer transporter with Gmail
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Your Gmail address
//     pass: process.env.EMAIL_PASS, // Your 16-character App Password
//   },
// });

// export async function POST(request: Request) {
//   try {
//     const { to, subject, courseDetails, paymentDetails } = await request.json();

//     if (!to || !subject || !courseDetails || !paymentDetails) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Your verified sender email
//       to: to,
//       subject: subject,
//       html: `
//         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
//           <div style="background-color: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
//             <h1 style="margin: 0;">Course Enrollment Confirmation</h1>
//           </div>

//           <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
//             <p>Thank you for enrolling in our course! Your payment has been successfully processed.</p>

//             <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Course Details</h2>
//               <p><strong>Course:</strong> ${courseDetails.name}</p>
//               <p><strong>Instructor:</strong> ${courseDetails.instructor}</p>
//               <p><strong>Duration:</strong> ${courseDetails.duration} hours</p>
//             </div>

//             <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Payment Details</h2>
//               <p><strong>Order ID:</strong> ${paymentDetails.orderId}</p>
//               <p><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</p>
//               <p><strong>Payment Status:</strong> ${paymentDetails.status}</p>
//               <p><strong>Transaction ID:</strong> ${
//                 paymentDetails.transactionId
//               }</p>
//               <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//             </div>

//             <div style="margin-top: 30px; text-align: center;">
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
//         courseDetails.id
//       }"
//                  style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px;
//                         text-decoration: none; border-radius: 6px; font-weight: bold;">
//                 Start Learning
//               </a>
//             </div>

//             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
//               <p style="color: #64748b; font-size: 14px;">
//                 If you have any questions, please contact our support team at support@codenest.com
//               </p>
//             </div>
//           </div>
//         </div>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Failed to send email:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to send email" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your App Password
  },
});

export async function POST(request: Request) {
  try {
    const { to, subject, courseDetails, paymentDetails } = await request.json();

    if (!to || !subject || !courseDetails || !paymentDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // const mailOptions = {
    //   from: `"CodeNest Academy" <${process.env.EMAIL_USER}>`,
    //   to: to,
    //   subject: subject,
    //   html: `
    //   <div style="font-family: 'Arial', sans-serif; background-color: #0f172a; color: #fff; padding: 40px; text-align: center; border-radius: 10px;">

    //     <h1 style="margin: 0; font-size: 28px; background: linear-gradient(90deg, #ff416c, #ff4b2b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
    //       🎉 Welcome to CodeNest Academy! 🚀
    //     </h1>
    //     <p style="font-size: 18px; margin-top: 10px; color: #e0e0e0;">
    //       Your learning adventure has just begun! Get ready to elevate your skills.
    //     </p>

    //     <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);">
    //       <h2 style="color: #ffcc00; font-size: 20px; margin-bottom: 10px;">✨ Course Details ✨</h2>
    //       <p><strong>📚 Course:</strong> ${courseDetails.name}</p>
    //       <p><strong>👨‍🏫 Instructor:</strong> ${courseDetails.instructor}</p>
    //       <p><strong>⏳ Duration:</strong> ${courseDetails.duration} hours</p>
    //     </div>

    //     <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);">
    //       <h2 style="color: #00e676; font-size: 20px; margin-bottom: 10px;">💳 Payment Details 💳</h2>
    //       <p><strong>🆔 Order ID:</strong> ${paymentDetails.orderId}</p>
    //       <p><strong>💰 Amount Paid:</strong> ₹${paymentDetails.amount}</p>
    //       <p><strong>✅ Payment Status:</strong> ${paymentDetails.status}</p>
    //       <p><strong>🔗 Transaction ID:</strong> ${
    //         paymentDetails.transactionId
    //       }</p>
    //       <p><strong>📅 Date:</strong> ${new Date().toLocaleString()}</p>
    //     </div>

    //     <div style="margin-top: 30px;">
    //       <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
    //     courseDetails.id
    //   }"
    //          style="display: inline-block; background: linear-gradient(90deg, #ff416c, #ff4b2b); color: white; padding: 12px 24px;
    //                 text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; transition: 0.3s;">
    //         🚀 Start Learning Now
    //       </a>
    //     </div>

    //     <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
    //       <p style="color: #bbb; font-size: 14px;">
    //         Need help? Our support team is here for you:
    //         <a href="mailto:support@codenest.com" style="color: #ffcc00; text-decoration: none;">support@codenest.com</a>
    //       </p>
    //       <p style="color: #666; font-size: 12px;">© 2025 CodeNest Academy. All Rights Reserved.</p>
    //     </div>
    //   </div>
    //   `,
    // };

    const mailOptions = {
      from: `"CodeNest Academy" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
      <div style="font-family: 'Arial', sans-serif; background-color: #0f172a; color: #ffffff; padding: 40px; text-align: center; border-radius: 10px;">
        
        <h1 style="margin: 0; font-size: 32px; background: linear-gradient(90deg, #ff416c, #ff4b2b); 
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
          🎉 Welcome to <span style="color: #ffcc00;">CodeNest Academy</span>! 🚀
        </h1>
        <p style="font-size: 18px; margin-top: 10px; color: #e0e0e0;">
          Your learning adventure has just begun! Get ready to elevate your skills. 🌟
        </p>
    
        <!-- Course Details -->
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; 
                    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);">
          <h2 style="color: #ffcc00; font-size: 22px; margin-bottom: 15px; text-shadow: 0px 0px 10px #ffcc00;">
            ✨ Course Details ✨
          </h2>
          <p style="font-size: 18px;"><strong>📚 Course:</strong> <span style="color: #00eaff;">${
            courseDetails.name
          }</span></p>
          <p style="font-size: 18px;"><strong>👨‍🏫 Instructor:</strong> <span style="color: #ff80ff;">${
            courseDetails.instructor
          }</span></p>
          <p style="font-size: 18px;"><strong>⏳ Duration:</strong> <span style="color: #ffa500;">${
            courseDetails.duration
          } hours</span></p>
        </div>
    
        <!-- Payment Details -->
        <div style="background-color: #1e293b; padding: 20px; border-radius: 10px; margin-top: 20px; 
                    box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);">
          <h2 style="color: #00e676; font-size: 22px; margin-bottom: 15px; text-shadow: 0px 0px 10px #00e676;">
            💳 Payment Details 💳
          </h2>
          <p style="font-size: 18px;"><strong>🆔 Order ID:</strong> <span style="color: #ff80ff;">${
            paymentDetails.orderId
          }</span></p>
          <p style="font-size: 18px;"><strong>💰 Amount Paid:</strong> <span style="color: #00eaff;">₹${
            paymentDetails.amount
          }</span></p>
          <p style="font-size: 18px;"><strong>✅ Payment Status:</strong> <span style="color: #00ff80;">${
            paymentDetails.status
          }</span></p>
          <p style="font-size: 18px;"><strong>🔗 Transaction ID:</strong> <span style="color: #ffa500;">${
            paymentDetails.transactionId
          }</span></p>
          <p style="font-size: 18px;"><strong>📅 Date:</strong> <span style="color: #e0e0e0;">${new Date().toLocaleString()}</span></p>
        </div>
    
        <!-- Call to Action Button -->
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses/${
        courseDetails.id
      }" 
             style="display: inline-block; background: linear-gradient(90deg, #ff416c, #ff4b2b); 
                    color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; 
                    font-weight: bold; font-size: 20px; transition: 0.3s; box-shadow: 0px 0px 15px rgba(255, 65, 108, 0.6);">
            🚀 Start Learning Now
          </a>
        </div>
    
        <!-- Footer Section -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
          <p style="color: #bbb; font-size: 16px;">
            Need help? Our support team is here for you: 
            <a href="mailto:support@codenest.com" style="color: #ffcc00; text-decoration: none;">support@codenest.com</a>
          </p>
          <p style="color: #666; font-size: 14px;">© 2025 CodeNest Academy. All Rights Reserved.</p>
        </div>
    
      </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
