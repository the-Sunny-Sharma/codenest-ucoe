import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import { User } from "@/models/userDetails";
import CourseChapterView from "./CourseChapterView";

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
      model: "Teacher",
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

  return course;
}

export default async function CourseChapterPage({
  params,
}: {
  params: { courseId: string; slug: string; chapterId: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const course = await getCourseDetails(params.courseId, params.slug);
  const userObjectId = await getUserObjectId(session.user.email!);

  const isEnrolled =
    userObjectId &&
    course.enrolledStudents.some(
      (studentId: string) => studentId.toString() === userObjectId
    );

  if (!isEnrolled) {
    redirect(`/courses/${params.courseId}/${params.slug}`);
  }

  // Find the active chapter
  let activeSection = null;
  let activeChapter = null;

  for (const section of course.sections) {
    const chapter = section.chapters.find(
      (ch: any) => ch._id.toString() === params.chapterId
    );
    if (chapter) {
      activeSection = section;
      activeChapter = chapter;
      break;
    }
  }

  if (!activeChapter) {
    // If chapter not found, redirect to the first chapter of the course
    if (course.sections.length > 0 && course.sections[0].chapters.length > 0) {
      const firstSection = course.sections.sort(
        (a: any, b: any) => a.order - b.order
      )[0];
      const firstChapter = firstSection.chapters.sort(
        (a: any, b: any) => a.order - b.order
      )[0];
      redirect(
        `/courses/${params.courseId}/${params.slug}/${firstChapter._id}`
      );
    } else {
      redirect(`/courses/${params.courseId}/${params.slug}`);
    }
  }

  return (
    <CourseChapterView
      course={course}
      user={session.user}
      activeChapterId={params.chapterId}
    />
  );
}
