import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/connectDB";
import Course from "@/models/Course";
import Teacher from "@/models/Teacher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, Users, Star, Award } from "lucide-react";
import Link from "next/link";
import mongoose from "mongoose";
import { VideoPlayer } from "@/components/client/VideoPlayer";
import { User } from "@/models/userDetails";

async function getUserObjectId(email: string) {
  if (!email) return null;
  const user = await User.findOne({ email }).select("_id").lean();
  return user ? user._id.toString() : null;
}

async function getCourseDetails(slug: string) {
  await connectToDatabase();

  const course = await Course.findOne({ slug })
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
    .lean(); // Convert the result to a plain JavaScript object

  if (!course) {
    notFound();
  }

  return course;
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const course = await getCourseDetails(params.slug);
  const totalMinutes = course.chapters.reduce(
    (acc, chapter) => acc + chapter.duration,
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Fetch the user's ObjectId using their email
  const userObjectId = session?.user?.email
    ? await getUserObjectId(session.user.email)
    : null;

  // Check if the user is enrolled
  const isEnrolled =
    userObjectId &&
    course.enrolledStudents.some((studentId) =>
      studentId.equals(new mongoose.Types.ObjectId(userObjectId))
    );

  console.log("Session User Email:", session?.user?.email);
  console.log("Session User ObjectId:", userObjectId);
  console.log("Enrolled Students:", course.enrolledStudents);

  // Format course features
  const courseFeatures = [
    "Lifetime access to all content",
    "Certificate of completion",
    "Access to course community",
    "Direct instructor support",
    "Downloadable resources",
    course.certificate ? "Verified certificate" : null,
  ].filter(Boolean);

  // Create enrollment page props
  const enrollmentProps = {
    studentEmail: session?.user.email,
    courseId: course._id,
    name: course.name,
    description: course.description,
    price: course.price,
    totalHours,
    enrolledStudents: course.enrolledStudents.length,
    chapters: course.chapters.map((chapter) => ({
      title: chapter.title,
      duration: chapter.duration,
    })),
    features: courseFeatures,
    level: course.level,
    language: course.language,
    instructor: {
      name: course.instructor?.user?.name,
      title: course.instructor?.title,
      avatarUrl: course.instructor?.user?.avatarUrl,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{course.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 font-medium">
                      {course.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="ml-1">
                      {course.enrolledStudents.length} students
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={
                        course.instructor?.user?.avatarUrl || "/placeholder.svg"
                      }
                      alt={course.instructor?.user?.name || "Instructor"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />

                    <div>
                      <p className="font-medium">
                        {`${course.instructor?.title ?? ""} ${
                          course.instructor?.user?.name ?? "Unknown Instructor"
                        }`.trim()}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Instructor
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>{course.level}</Badge>
                  <Badge variant="outline">{course.language}</Badge>
                  {course.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Card className="lg:sticky lg:top-8">
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  {/* <VideoPlayer url={course.promoVideo} /> */}
                  <VideoPlayer
                    url={course.promoVideo}
                    thumbnail={course.thumbnail}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                    {course.certificate && (
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 mr-1" />
                        Certificate Included
                      </div>
                    )}
                  </div>
                  {isEnrolled ? (
                    <Button className="w-full" size="lg">
                      Continue Learning
                    </Button>
                  ) : (
                    // <PaymentButton
                    //   courseId={course._id.toString()}
                    //   price={course.price}
                    //   studentEmail={session?.user.email}
                    // />
                    <Button className="w-full" size="lg" asChild>
                      <Link
                        href={{
                          pathname: `/courses/${course.slug}/enroll`,
                          query: { data: JSON.stringify(enrollmentProps) },
                        }}
                      >
                        Enroll Now
                      </Link>
                    </Button>
                  )}
                  <div className="text-sm text-center text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <div className="prose max-w-none">{course.description}</div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{course.chapters.length} chapters</span>
                    <span>
                      {totalHours}h {remainingMinutes}m total length
                    </span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {course.chapters.map((chapter: any, index: number) => (
                    <AccordionItem key={chapter._id} value={`chapter-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center">
                          <span className="font-medium">{chapter.title}</span>
                          <div className="ml-auto flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {Math.floor(chapter.duration / 60)}h{" "}
                            {chapter.duration % 60}m
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-4 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {chapter.description}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {course.prerequisites.map((prerequisite: string) => (
                    <li key={prerequisite}>{prerequisite}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  What you&apos;ll learn
                </h3>
                <ul className="space-y-2">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {course.chapters.slice(0, 5).map((chapter: any) => (
                    <li key={chapter._id} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{chapter.title}</span>
                    </li>
                  ))}
                </ul>
                {course.chapters.length > 5 && (
                  <Button variant="link" className="mt-2 p-0">
                    Show more
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// async function getCourseDetails(slug: string) {
//   await connectToDatabase()

//   const course = await Course.findOne({ slug }).populate({
//     path: "instructor",
//     model: Teacher,
//     populate: {
//       path: "user",
//       select: "name avatarUrl",
//     },
//   })

//   if (!course) {
//     notFound()
//   }

//   return course
// }

// export default async function CourseDetailsPage({
//   params,
// }: {
//   params: { slug: string }
// }) {
//   const session = await auth()
//   const course = await getCourseDetails(params.slug)
//   const totalMinutes = course.chapters.reduce((acc, chapter) => acc + chapter.duration, 0)
//   const totalHours = Math.floor(totalMinutes / 60)
//   const remainingMinutes = totalMinutes % 60

//   const isEnrolled = session?.user && course.enrolledStudents.includes(session.user.id)

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-muted/50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div>
//               <div className="space-y-4">
//                 <h1 className="text-3xl font-bold">{course.name}</h1>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center">
//                     <Star className="h-5 w-5 text-yellow-400" />
//                     <span className="ml-1 font-medium">{course.rating.toFixed(1)}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Users className="h-5 w-5 text-muted-foreground" />
//                     <span className="ml-1">{course.enrolledStudents.length} students</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2">
//                     <Image
//                       src={course.instructor.user.avatarUrl || "/placeholder.svg"}
//                       alt={course.instructor.user.name}
//                       width={40}
//                       height={40}
//                       className="rounded-full"
//                     />
//                     <div>
//                       <p className="font-medium">{course.instructor.user.name}</p>
//                       <p className="text-sm text-muted-foreground">Instructor</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   <Badge>{course.level}</Badge>
//                   <Badge variant="outline">{course.language}</Badge>
//                   {course.tags.map((tag: string) => (
//                     <Badge key={tag} variant="secondary">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Card className="lg:sticky lg:top-8">
//               <CardContent className="p-6">
//                 <div className="aspect-video rounded-lg overflow-hidden mb-4">
//                   <VideoPlayer url={course.promoVideo} />
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-3xl font-bold">₹{course.price}</span>
//                     {course.certificate && (
//                       <div className="flex items-center text-sm">
//                         <Award className="h-4 w-4 mr-1" />
//                         Certificate Included
//                       </div>
//                     )}
//                   </div>
//                   {isEnrolled ? (
//                     <Button className="w-full" size="lg">
//                       Continue Learning
//                     </Button>
//                   ) : (
//                     <Button className="w-full" size="lg" asChild>
//                       <Link href={`/courses/${course.slug}/enroll`}>Enroll Now</Link>
//                     </Button>
//                   )}
//                   <div className="text-sm text-center text-muted-foreground">30-day money-back guarantee</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="space-y-8">
//               <section>
//                 <h2 className="text-2xl font-bold mb-4">About This Course</h2>
//                 <div className="prose max-w-none">{course.description}</div>
//               </section>

//               <Separator />

//               <section>
//                 <h2 className="text-2xl font-bold mb-4">Course Content</h2>
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm mb-2">
//                     <span>{course.chapters.length} chapters</span>
//                     <span>
//                       {totalHours}h {remainingMinutes}m total length
//                     </span>
//                   </div>
//                   <Progress value={0} className="h-2" />
//                 </div>
//                 <Accordion type="single" collapsible className="w-full">
//                   {course.chapters.map((chapter: any, index: number) => (
//                     <AccordionItem key={chapter._id} value={`chapter-${index}`}>
//                       <AccordionTrigger className="hover:no-underline">
//                         <div className="flex items-center">
//                           <span className="font-medium">{chapter.title}</span>
//                           <div className="ml-auto flex items-center text-sm text-muted-foreground">
//                             <Clock className="h-4 w-4 mr-1" />
//                             {Math.floor(chapter.duration / 60)}h {chapter.duration % 60}m
//                           </div>
//                         </div>
//                       </AccordionTrigger>
//                       <AccordionContent>
//                         <div className="pl-4 space-y-2">
//                           <p className="text-sm text-muted-foreground">{chapter.description}</p>
//                         </div>
//                       </AccordionContent>
//                     </AccordionItem>
//                   ))}
//                 </Accordion>
//               </section>

//               <Separator />

//               <section>
//                 <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
//                 <ul className="list-disc pl-5 space-y-2">
//                   {course.prerequisites.map((prerequisite: string) => (
//                     <li key={prerequisite}>{prerequisite}</li>
//                   ))}
//                 </ul>
//               </section>
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             <Card>
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
//                 <ul className="space-y-2">
//                   {course.chapters.slice(0, 5).map((chapter: any) => (
//                     <li key={chapter._id} className="flex items-start">
//                       <span className="mr-2">•</span>
//                       <span>{chapter.title}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 {course.chapters.length > 5 && (
//                   <Button variant="link" className="mt-2 p-0">
//                     Show more
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
