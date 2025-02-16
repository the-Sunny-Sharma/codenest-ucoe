import mongoose, { type Document, Schema } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  studentEmail: string;
  amount: number;
  currency: string;
  status: "pending" | "successful" | "failed";
  paymentSessionId?: string;
  transactionId?: string;
  paymentMethod?: string;
  gateway: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true, // ✅ Index for faster lookups
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true, // ✅ Queries will be faster
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true, // ✅ Since payments are queried per student
    },
    studentEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
      required: true,
    },
    paymentSessionId: String,
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // ✅ Ensures unique transactionId but allows null values
    },
    paymentMethod: String,
    gateway: {
      type: String,
      required: true, // ✅ Specify which gateway processed the transaction
      default: "Cashfree",
    },
    failureReason: String, // ✅ Store reason for failed payments
  },
  { timestamps: true }
);

// ✅ Add compound index for faster retrievals (optional)
PaymentSchema.index({ studentId: 1, courseId: 1, status: 1 });

const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
