import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          "manage_users",
          "manage_courses",
          "manage_payments",
          "view_analytics",
        ],
      },
    ],
    lastLogin: Date,
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
