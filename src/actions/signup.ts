"use server";

import { hash } from "bcryptjs";
import { User } from "@/models/userDetails";
import { connectToDatabase } from "@/lib/connectDB";

export async function CredentialsSignUp(
  name: string,
  email: string,
  password: string
) {
  console.log(` Name: ${name}, Email: ${email}`);
  try {
    //connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(
      "Checked for existing user:",
      existingUser ? "Found" : "Not found"
    );

    if (existingUser) {
      return { success: false, message: "Email already in use", status: 400 };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate avatar URL using DiceBear
    const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
      name
    )}`;

    // Create new user
    await User.create({
      name,
      email,
      password: hashedPassword,
      avatarUrl,
    });

    return {
      success: true,
      message: "User created successfully",
      status: 201,
    };
  } catch (error) {
    console.error("Error in sign-up:", error);

    //check if the error is an instance of error
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Internal server error",
      status: 500,
    };
  }
}
