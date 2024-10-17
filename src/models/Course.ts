import mongoose, { Schema, Document } from "mongoose";

export interface IChapter extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  liveSessionDate?: Date;
  duration: number;
  order: number;
}

export interface ICourse extends Document {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  promoVideo: string;
  instructor: mongoose.Types.ObjectId;
  price: number;
  enrolledStudents: mongoose.Types.ObjectId[];
  classCode: string;
  totalHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  prerequisites: string[];
  chapters: IChapter[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  rating: number;
  numberOfReviews: number;
  language: string;
  certificate: boolean;
}

const ChapterSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String },
  liveSessionDate: { type: Date },
  duration: { type: Number, required: true },
  order: { type: Number, required: true },
});

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  promoVideo: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
  classCode: { type: String, required: true, unique: true },
  totalHours: { type: Number, required: true },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  tags: [{ type: String }],
  prerequisites: [{ type: String }],
  chapters: [ChapterSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date },
  rating: { type: Number, default: 0 },
  numberOfReviews: { type: Number, default: 0 },
  language: { type: String, required: true },
  certificate: { type: Boolean, default: false },
});

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
