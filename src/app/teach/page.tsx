"use client";

import { Footer } from "@/components/client/Footer";
import { Navbar } from "@/components/client/Navbar";
import { TeacherRegistrationForm } from "@/components/client/TeacherRegistrationForm";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TeachPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkTeacherStatus = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get("/api/teacher/status");
          if (response.data.success) {
            router.push("/dashboard");
          } else {
          }
        } catch (error: any) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error("User not found. Please sign up.");
              router.push("/signup");
            } else {
              toast.error("An error occurred. Please try again.");
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
          console.error("Error checking teacher status:", error);
        }
      }
    };

    checkTeacherStatus();
  }, [status, router]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto py-10 px-20">
        <h1 className="text-3xl font-bold mb-6">Become a Teacher</h1>
        <p className="mb-8">
          Fill out the form below to register as a teacher on our platform.
        </p>
        <TeacherRegistrationForm />
      </div>
      <Footer />
    </div>
  );
}
