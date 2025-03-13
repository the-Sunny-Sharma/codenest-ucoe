import { Suspense } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import { User } from "@/models/userDetails";
import CourseDetailsEnrolled from "./CourseDetailsEnrolled";
import CourseDetailsNotEnrolled from "./CourseDetailsNotEnrolled";
import { Skeleton } from "@/components/ui/skeleton";

async function getUserObjectId(email: string) {
  if (!email) return null;
  await connectToDatabase();
  const user = await User.findOne({ email }).select("_id").lean();
  return user ? user._id.toString() : null;
}

async function getCourseDetails(courseId: string, slug: string) {
  await connectToDatabase();

  const course = await Course.findOne({ _id: courseId, slug })
    .populate({
      path: "instructor",
      model: Teacher,
      populate: {
        path: "user",
        model: "User",
        select: "name avatarUrl",
      },
      select: "title qualifications expertise bio averageRating",
    })
    .lean();

  if (!course) {
    notFound();
  }

  // Convert all ObjectIds and Buffers to strings
  return JSON.parse(
    JSON.stringify(course, (key, value) =>
      value instanceof Object && value._bsontype === "ObjectId"
        ? value.toString()
        : value
    )
  );
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string; slug: string };
}) {
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  const course = await getCourseDetails(params.courseId, params.slug);
  const userObjectId = await getUserObjectId(session.user.email!);

  const isEnrolled =
    userObjectId &&
    course.enrolledStudents.some(
      (studentId: string) => studentId.toString() === userObjectId
    );

  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      {isEnrolled ? (
        <CourseDetailsEnrolled course={course} user={session.user} />
      ) : (
        <CourseDetailsNotEnrolled course={course} user={session.user} />
      )}
    </Suspense>
  );
}

function CourseDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
