import mongoose, { Document } from "mongoose";

export interface ITeacher extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  expertise: string[];
  bio: string;
  courses: mongoose.Types.ObjectId[];
  ratings: Array<{
    student: mongoose.Types.ObjectId;
    rating: number;
    review: string;
  }>;
  averageRating: number;
}

const TeacherSchema = new mongoose.Schema<ITeacher>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      enum: ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms.", "Sir"],
      required: true,
    },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    expertise: [String],
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    ratings: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Teacher =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;
