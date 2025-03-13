import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
// import type { Metadata } from "next";
import CourseManagement from "./_components/CourseManagement";
import { Skeleton } from "@/components/ui/skeleton";
import TeacherLayout from "@/components/client/layouts/TeacherLayout";

interface PageProps {
  params: { courseId: string };
}

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const course = await getCourse(params.courseId);
//   return {
//     title: `Manage Course: ${course?.name || "Not Found"}`,
//     description: `Manage and update your course: ${course?.name}`,
//   };
// }

async function getCourse(courseId: string) {
  // console.log("Fetching course with ID:", courseId);
  await connectToDatabase();
  const course = await Course.findById(courseId).lean();

  if (!course) {
    console.log("Course not found!");
    notFound();
  }

  // console.log("Course found:", course);
  // return course;

  // Convert ObjectId fields to string manually
  // return {
  //   ...course,
  //   _id: course._id.toString(),
  //   instructor: course.instructor.toString(),
  //   enrolledStudents: course.enrolledStudents.map((student) =>
  //     student.toString()
  //   ), // ✅ Convert ObjectId to string
  //   createdAt: course.createdAt.toISOString(),
  //   updatedAt: course.updatedAt.toISOString(),
  //   sections: course.sections.map((section) => ({
  //     ...section,
  //     chapters: section.chapters.map((chapter) => ({
  //       ...chapter,
  //       _id: chapter._id.toString(),
  //     })),
  //   })),
  // };`
  return {
    ...course,
    _id: course._id.toString(),
    instructor: course.instructor.toString(),
    enrolledStudents: course.enrolledStudents.map((s) => s.toString()),
    sections: course.sections.map((section) => ({
      ...section,
      _id: section._id.toString(),
      chapters: section.chapters.map((chapter) => ({
        ...chapter,
        _id: chapter._id.toString(),
        resources: chapter.resources.map((res) => ({
          ...res,
          _id: res._id?.toString(),
        })),
      })),
    })),
  };
}

export default async function CourseManagementPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) {
    return notFound();
  }

  const course = await getCourse(params.courseId);

  // if (course.instructor.toString() !== session.user.id) {
  //   return notFound();
  // }

  return (
    <TeacherLayout>
      <Suspense fallback={<CourseManagementSkeleton />}>
        <CourseManagement initialCourse={course} />
      </Suspense>
    </TeacherLayout>
  );
}

function CourseManagementSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Skeleton className="h-12 w-3/4 max-w-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    </div>
  );
}
