// import { redirect } from "next/navigation";
// import { auth } from "@/auth";
// import { connectToDatabase } from "@/lib/connectDB";
// import Course from "@/models/Course";
// import EnrollmentForm from "./EnrollmentForm";

// export default async function EnrollPage({
//   params,
//   searchParams,
// }: {
//   params: { courseId: string; slug: string };
//   searchParams: { code?: string; data?: string };
// }) {
//   const session = await auth();
//   if (!session?.user) {
//     redirect("/login");
//   }

//   await connectToDatabase();
//   let course = await Course.findOne({
//     _id: params.courseId,
//     slug: params.slug,
//   }).lean();

//   if (!course) {
//     redirect("/courses");
//   }

//   // Convert _id and other ObjectId fields to strings
//   course = JSON.parse(JSON.stringify(course));

//   // If class code is provided in URL, verify and auto-enroll
//   if (searchParams.code) {
//     console.log(searchParams);
//     // if (course.classCode === searchParams.code) {
//     //   // Auto-enroll logic here
//     //   redirect(`/courses/${params.courseId}/${params.slug}`);
//     // }
//   }

//   return (
//     <EnrollmentForm
//       courseDetails={course}
//       user={session.user}
//       classCodeFromUrl={searchParams.code}
//     />
//   );
// }
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import EnrollmentForm from "./EnrollmentForm";

export default async function EnrollPage({
  params,
  searchParams,
}: {
  params: { courseId: string; slug: string };
  searchParams: { code?: string; data?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  await connectToDatabase();
  let course = await Course.findOne({
    _id: params.courseId,
    slug: params.slug,
  })
    .populate({
      path: "instructor",
      select: "name title avatarUrl",
    })
    .lean();

  if (!course) {
    redirect("/courses");
  }

  // Convert _id and other ObjectId fields to strings
  course = JSON.parse(JSON.stringify(course));

  return (
    <EnrollmentForm
      courseDetails={course}
      user={session.user}
      classCodeFromUrl={searchParams.code}
    />
  );
}
