"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

/**
 * Handles user login via credentials (email & password).
 * Uses NextAuth's `signIn` function to authenticate users.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Error message if login fails, otherwise `null` (successful login)
 */
const credentialsLogin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    // Attempt to sign in with credentials, without redirecting
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // Ensures the function handles redirection manually
    });

    // If the response is unexpectedly null, return a generic error message
    if (!response) {
      console.error("Unexpected null response from signIn");
      return "An unexpected error occurred. Please try again.";
    }

    // Handle authentication errors returned by NextAuth
    if (response.error) {
      console.warn("Login failed:", response.error); // Log warning instead of error for expected failures
      return response.error; // Return the error message to be displayed to the user
    }

    return null; // Login successful, no error message needed
  } catch (error: unknown) {
    // Ensure error is properly typed and handled
    if (error instanceof CredentialsSignin) {
      console.error("CredentialsSignin error:", error.cause);
      return typeof error.cause === "string"
        ? error.cause
        : "An unexpected authentication error occurred. Please try again."; // Fallback if `cause` is not a string
    }

    console.error("Unexpected login error:", error);
    return "An unexpected error occurred. Please try again."; // Generic error message
  }
};

export { credentialsLogin };
