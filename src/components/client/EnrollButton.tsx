"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleEnroll = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll");
      }

      const data = await response.json();
      toast.success("Successfully enrolled in course!");
      router.push(`/learn/${data.slug}`);
    } catch (error) {
      toast.error("Failed to enroll in course");
      console.error("Error enrolling in course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      className="w-full"
      size="lg"
      disabled={isLoading}
    >
      {isLoading ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
