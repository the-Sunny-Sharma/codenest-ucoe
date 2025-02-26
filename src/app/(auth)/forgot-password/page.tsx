"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide your email address");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      // TODO: Implement your password reset logic here
      // const response = await resetPassword(email);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);
      toast.success("Reset link sent to your email", { id: toastId });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Reset Password
          </h1>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success ? (
            <div className="text-center space-y-4">
              <Alert>
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                  We&apos;ve sent a password reset link to {email}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground mt-4">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setSuccess(false)}
                >
                  try again
                </Button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
