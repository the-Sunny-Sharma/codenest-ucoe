import ChapterView from "./_components/chapterView";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";

interface PageProps {
  params: {
    courseId: string;
    slug: string;
    sectionOrder: string;
    chapterId: string;
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  // const course = await Course.findById(params.courseId)
  //   .populate("instructor")
  //   .lean();
  const course = await Course.findById(params.courseId)
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
    return redirect("/");
  }

  // const isEnrolled = course.enrolledStudents.includes(session.user.id);

  // if (!isEnrolled) {
  //   return redirect(`/courses/${params.courseId}/${params.slug}`);
  // }

  return <ChapterView course={course} {...params} />;
}
