"use client";

import { useRouter } from "next/navigation";
import { CourseNotFound } from "./_components/CourseNotFound";

export default function TeacherCourseNotFound() {
  const router = useRouter();

  return (
    <CourseNotFound
      message="Course Not Found"
      description="The course you're looking for doesn't exist or you don't have permission to view it."
      actionLabel="Go to My Courses"
      onAction={() => router.push("/my-courses")}
    />
  );
}
