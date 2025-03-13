"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/client/VideoPlayer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Award,
  Clock,
  FileText,
  Star,
  Users,
  Calendar,
  Video,
  Radio,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function CourseDetailsNotEnrolled({
  course,
  user,
}: {
  course: any;
  user: any;
}) {
  // Create enrollment props
  const enrollmentProps = {
    studentEmail: user.email,
    courseId: course._id,
    name: course.name,
    description: course.description,
    price: course.price,
    totalHours: course.totalHours,
    enrolledStudents: course.enrolledStudents?.length || 0,
    chapters:
      course.sections?.flatMap((section: any) =>
        section.chapters?.map((chapter: any) => ({
          title: chapter.title,
          duration: Math.ceil(chapter.duration / 60), // Convert seconds to minutes
        }))
      ) || [],
    features: [
      "Lifetime access to all content",
      "Certificate of completion",
      "Access to course community",
      "Direct instructor support",
      "Downloadable resources",
      course.certificate ? "Verified certificate" : null,
    ].filter(Boolean),
    level: course.level,
    language: course.language,
    instructor: {
      name: course.instructor?.user?.name,
      title: course.instructor?.title,
      avatarUrl: course.instructor?.user?.avatarUrl,
    },
  };

  // Sort sections by order
  const sortedSections = [...(course.sections || [])].sort(
    (a, b) => a.order - b.order
  );

  // Calculate total chapters
  const totalChapters = sortedSections.reduce(
    (total, section) => total + (section.chapters?.length || 0),
    0
  );

  // Calculate total content duration in hours and minutes
  const totalContentHours = Math.floor(course.totalHours);
  const totalContentMinutes = Math.round(
    (course.totalHours - totalContentHours) * 60
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />

                  <span className="ml-1 font-medium">
                    {course.rating?.toFixed(1) || "N/A"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground" />

                  <span className="ml-1">
                    {course.enrolledStudents?.length || 0} students
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="ml-1">
                    {totalContentHours}h {totalContentMinutes}m total
                  </span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="ml-1">{totalChapters} chapters</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={
                    course.instructor?.user?.avatarUrl ||
                    "/placeholder.svg?height=40&width=40" ||
                    "/placeholder.svg"
                  }
                  alt={course.instructor?.user?.name || "Instructor"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">
                    {course.instructor?.user?.name || "Unknown Instructor"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor?.title || "Instructor"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{course.level}</Badge>
                <Badge variant="outline">{course.language}</Badge>
                {course.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {course.certificate && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Certificate
                  </Badge>
                )}
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{course.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {totalChapters} chapters • {totalContentHours}h{" "}
                  {totalContentMinutes}m total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    sortedSections.map((section: any, sectionIndex: number) => {
                      // Sort chapters by order
                      const sortedChapters = [...(section.chapters || [])].sort(
                        (a, b) => a.order - b.order
                      );
                      // Calculate section duration in minutes
                      const sectionDurationMinutes = Math.ceil(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        sortedChapters.reduce(
                          (total: number, chapter: any) =>
                            total + (chapter.duration || 0),
                          0
                        ) / 60
                      );
                      return (
                        <AccordionItem
                          key={section._id}
                          value={`section-${sectionIndex}`}
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center">
                                <span className="font-medium text-left">
                                  Section {section.order}: {section.title}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-2">
                                  {sortedChapters.length} chapters
                                </span>
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{sectionDurationMinutes}m</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-4 space-y-4">
                              <p className="text-sm text-muted-foreground">
                                {section.description}
                              </p>
                              {section.whatYoullLearn?.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">
                                    What you&apos;ll learn:
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {section.whatYoullLearn.map(
                                      (item: string, idx: number) => (
                                        <li key={idx} className="text-sm">
                                          {item}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              {section.prerequisites?.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">
                                    Prerequisites:
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {section.prerequisites.map(
                                      (item: string, idx: number) => (
                                        <li key={idx} className="text-sm">
                                          {item}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                              <div className="mt-4 space-y-2">
                                {sortedChapters.map(
                                  (chapter: any, chapterIndex: number) => {
                                    const chapterDurationMinutes = Math.ceil(
                                      chapter.duration / 60
                                    );
                                    // Check if the chapter has a scheduled time in the future
                                    const isScheduledInFuture =
                                      chapter.scheduledTime &&
                                      new Date(chapter.scheduledTime) >
                                        new Date();
                                    // Check if it's a live lecture that's currently live
                                    const isLiveNow =
                                      chapter.lectureType === "liveLecture" &&
                                      chapter.isLive &&
                                      chapter.scheduledTime &&
                                      new Date(chapter.scheduledTime) <=
                                        new Date();
                                    // Determine the icon to show based on lecture type and status
                                    let ChapterIcon = Video;
                                    let iconColor = "text-blue-500";
                                    if (chapter.lectureType === "liveLecture") {
                                      if (isScheduledInFuture) {
                                        ChapterIcon = Calendar;
                                        iconColor = "text-orange-500";
                                      } else if (isLiveNow) {
                                        ChapterIcon = Radio;
                                        iconColor = "text-red-500";
                                      }
                                    } else if (isScheduledInFuture) {
                                      // Prerecorded video scheduled for future release
                                      ChapterIcon = Calendar;
                                      iconColor = "text-purple-500";
                                    }
                                    return (
                                      <div
                                        key={chapter._id}
                                        className="flex items-center justify-between py-2 border-b last:border-0"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0">
                                            <ChapterIcon
                                              className={`h-5 w-5 ${iconColor}`}
                                            />
                                          </div>
                                          <div>
                                            <p className="font-medium">
                                              {chapter.order}. {chapter.title}
                                            </p>
                                            {isScheduledInFuture && (
                                              <p className="text-xs text-muted-foreground">
                                                {chapter.lectureType ===
                                                "liveLecture"
                                                  ? "Live session"
                                                  : "Available"}
                                                :{" "}
                                                {new Date(
                                                  chapter.scheduledTime
                                                ).toLocaleDateString()}{" "}
                                                at{" "}
                                                {new Date(
                                                  chapter.scheduledTime
                                                ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                                <CountdownTimer
                                                  scheduledTime={
                                                    chapter.scheduledTime
                                                  }
                                                />
                                              </p>
                                            )}
                                            {isLiveNow && (
                                              <p className="text-xs text-red-500 font-medium">
                                                Live session in progress
                                              </p>
                                            )}
                                            {chapter.lectureType ===
                                              "prerecordedVideo" &&
                                              !isScheduledInFuture && (
                                                <p className="text-xs text-muted-foreground">
                                                  Prerecorded video
                                                </p>
                                              )}
                                          </div>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Clock className="h-4 w-4 mr-1" />
                                          <span>{chapterDurationMinutes}m</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })
                  }
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
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
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/courses/${course._id}/${course.slug}/enroll`}>
                      Enroll Now
                    </Link>
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What You&apos;ll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {sortedSections
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .flatMap(
                      (section: any) =>
                        section.whatYoullLearn?.slice(0, 2) || []
                    )
                    .slice(0, 6)
                    .map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
                <Button variant="link" className="mt-4 p-0 h-auto">
                  Show more <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>This Course Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Video className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>
                      {totalContentHours}h {totalContentMinutes}m on-demand
                      video
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>{totalChapters} chapters</span>
                  </li>
                  {course.certificate && (
                    <li className="flex items-center">
                      <Award className="h-5 w-5 text-muted-foreground mr-2" />
                      <span>Certificate of completion</span>
                    </li>
                  )}
                  <li className="flex items-center">
                    <Radio className="h-5 w-5 text-muted-foreground mr-2" />
                    <span>Live sessions with instructor</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {course.prerequisites?.map(
                (prerequisite: string, idx: number) => (
                  <li key={idx}>{prerequisite}</li>
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { VideoPlayer } from "@/components/client/VideoPlayer";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Award,
//   Clock,
//   FileText,
//   Star,
//   Users,
//   Calendar,
//   Video,
//   Radio,
//   CheckCircle,
//   ChevronRight,
// } from "lucide-react";
// import CountdownTimer from "./CountdownTimer";

// // Helper function to format time remaining
// const formatTimeRemaining = (scheduledTime: string | Date) => {
//   const now = new Date();
//   const scheduleDate = new Date(scheduledTime);
//   const timeRemaining = scheduleDate.getTime() - now.getTime();

//   if (timeRemaining <= 0) return "Starting soon";

//   const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

//   if (days > 0) return `${days}d ${hours}h remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;
//   return `${minutes}m remaining`;
// };

// // Add this new component
// // const CountdownTimer = ({
// //   scheduledTime,
// // }: {
// //   scheduledTime: string | Date;
// // }) => {
// //   const [timeLeft, setTimeLeft] = useState("");

// //   useEffect(() => {
// //     const updateTimer = () => {
// //       setTimeLeft(formatTimeRemaining(scheduledTime));
// //     };

// //     // Initial update
// //     updateTimer();

// //     // Update every minute
// //     const interval = setInterval(updateTimer, 60000);

// //     return () => clearInterval(interval);
// //   }, [scheduledTime]);

// //   return <span className="ml-2 text-orange-500">{timeLeft}</span>;
// // };

// export default function CourseDetailsNotEnrolled({
//   course,
//   user,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   course: any;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   user: any;
// }) {
//   // Create enrollment props
//   const enrollmentProps = {
//     studentEmail: user.email,
//     courseId: course._id,
//     name: course.name,
//     description: course.description,
//     price: course.price,
//     totalHours: course.totalHours,
//     enrolledStudents: course.enrolledStudents?.length || 0,
//     chapters:
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       course.sections?.flatMap((section: any) =>
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         section.chapters?.map((chapter: any) => ({
//           title: chapter.title,
//           duration: Math.ceil(chapter.duration / 60), // Convert seconds to minutes
//         }))
//       ) || [],
//     features: [
//       "Lifetime access to all content",
//       "Certificate of completion",
//       "Access to course community",
//       "Direct instructor support",
//       "Downloadable resources",
//       course.certificate ? "Verified certificate" : null,
//     ].filter(Boolean),
//     level: course.level,
//     language: course.language,
//     instructor: {
//       name: course.instructor?.user?.name,
//       title: course.instructor?.title,
//       avatarUrl: course.instructor?.user?.avatarUrl,
//     },
//   };

//   // Sort sections by order
//   const sortedSections = [...(course.sections || [])].sort(
//     (a, b) => a.order - b.order
//   );

//   // State for countdown timers
//   // const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>(
//   //   {}
//   // );

//   // Update countdown timers every minute
//   // useEffect(() => {
//   //   const updateTimers = () => {
//   //     const newTimeRemaining: { [key: string]: string } = {};

//   //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   //     sortedSections.forEach((section: any) => {
//   //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   //       section.chapters?.forEach((chapter: any) => {
//   //         if (chapter.isLive && chapter.scheduledTime) {
//   //           newTimeRemaining[chapter._id] = formatTimeRemaining(
//   //             chapter.scheduledTime
//   //           );
//   //         }
//   //       });
//   //     });

//   //     setTimeRemaining(newTimeRemaining);
//   //   };

//   //   updateTimers();
//   //   const interval = setInterval(updateTimers, 60000); // Update every minute

//   //   return () => clearInterval(interval);
//   // }, [sortedSections]);

//   // Calculate total chapters and content duration
//   const totalChapters = sortedSections.reduce(
//     (total, section) => total + (section.chapters?.length || 0),
//     0
//   );

//   const totalContentHours = Math.floor(course.totalHours);
//   const totalContentMinutes = Math.round(
//     (course.totalHours - totalContentHours) * 60
//   );

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-8">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="md:col-span-2 space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
//               <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <div className="flex items-center">
//                   <Star className="h-5 w-5 text-yellow-400" />
//                   <span className="ml-1 font-medium">
//                     {course.rating?.toFixed(1) || "N/A"}
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Users className="h-5 w-5 text-muted-foreground" />
//                   <span className="ml-1">
//                     {course.enrolledStudents?.length || 0} students
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <Clock className="h-5 w-5 text-muted-foreground" />
//                   <span className="ml-1">
//                     {totalContentHours}h {totalContentMinutes}m total
//                   </span>
//                 </div>
//                 <div className="flex items-center">
//                   <FileText className="h-5 w-5 text-muted-foreground" />
//                   <span className="ml-1">{totalChapters} chapters</span>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4 mb-4">
//                 <Image
//                   src={
//                     course.instructor?.user?.avatarUrl ||
//                     "/placeholder.svg?height=40&width=40"
//                   }
//                   alt={course.instructor?.user?.name || "Instructor"}
//                   width={48}
//                   height={48}
//                   className="rounded-full"
//                 />
//                 <div>
//                   <p className="font-medium">
//                     {course.instructor?.user?.name || "Unknown Instructor"}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {course.instructor?.title || "Instructor"}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <Badge variant="default">{course.level}</Badge>
//                 <Badge variant="outline">{course.language}</Badge>
//                 {course.tags?.map((tag: string) => (
//                   <Badge key={tag} variant="secondary">
//                     {tag}
//                   </Badge>
//                 ))}
//                 {course.certificate && (
//                   <Badge
//                     variant="secondary"
//                     className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//                   >
//                     <Award className="h-3 w-3 mr-1" />
//                     Certificate
//                   </Badge>
//                 )}
//               </div>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle>About This Course</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="whitespace-pre-line">{course.description}</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Course Content</CardTitle>
//                 <CardDescription>
//                   {totalChapters} chapters • {totalContentHours}h{" "}
//                   {totalContentMinutes}m total length
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Accordion type="single" collapsible className="w-full">
//                   {
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     sortedSections.map((section: any, sectionIndex: number) => {
//                       // Sort chapters by order
//                       const sortedChapters = [...(section.chapters || [])].sort(
//                         (a, b) => a.order - b.order
//                       );

//                       // Calculate section duration in minutes
//                       const sectionDurationMinutes = Math.ceil(
//                         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                         sortedChapters.reduce(
//                           (total: number, chapter: any) =>
//                             total + (chapter.duration || 0),
//                           0
//                         ) / 60
//                       );

//                       return (
//                         <AccordionItem
//                           key={section._id}
//                           value={`section-${sectionIndex}`}
//                         >
//                           <AccordionTrigger className="hover:no-underline">
//                             <div className="flex items-center justify-between w-full pr-4">
//                               <div className="flex items-center">
//                                 <span className="font-medium text-left">
//                                   Section {section.order}: {section.title}
//                                 </span>
//                               </div>
//                               <div className="flex items-center text-sm text-muted-foreground">
//                                 <span className="mr-2">
//                                   {sortedChapters.length} chapters
//                                 </span>
//                                 <Clock className="h-4 w-4 mr-1" />
//                                 <span>{sectionDurationMinutes}m</span>
//                               </div>
//                             </div>
//                           </AccordionTrigger>
//                           <AccordionContent>
//                             <div className="pl-4 space-y-4">
//                               <p className="text-sm text-muted-foreground">
//                                 {section.description}
//                               </p>
//                               {section.whatYoullLearn?.length > 0 && (
//                                 <div className="space-y-2">
//                                   <h4 className="text-sm font-medium">
//                                     What you&apos;ll learn:
//                                   </h4>
//                                   <ul className="list-disc pl-5 space-y-1">
//                                     {section.whatYoullLearn.map(
//                                       (item: string, idx: number) => (
//                                         <li key={idx} className="text-sm">
//                                           {item}
//                                         </li>
//                                       )
//                                     )}
//                                   </ul>
//                                 </div>
//                               )}
//                               {section.prerequisites?.length > 0 && (
//                                 <div className="space-y-2">
//                                   <h4 className="text-sm font-medium">
//                                     Prerequisites:
//                                   </h4>
//                                   <ul className="list-disc pl-5 space-y-1">
//                                     {section.prerequisites.map(
//                                       (item: string, idx: number) => (
//                                         <li key={idx} className="text-sm">
//                                           {item}
//                                         </li>
//                                       )
//                                     )}
//                                   </ul>
//                                 </div>
//                               )}
//                               {/* <div className="mt-4 space-y-2">
//                                 {sortedChapters.map(
//                                   (chapter: any, chapterIndex: number) => {
//                                     const chapterDurationMinutes = Math.ceil(
//                                       chapter.duration / 60
//                                     );
//                                     const isScheduledLive =
//                                       chapter.isLive &&
//                                       chapter.scheduledTime &&
//                                       new Date(chapter.scheduledTime) >
//                                         new Date();

//                                     console.log("asdfasdf", chapter.isLive);
//                                     console.log(
//                                       "asdfasdf",
//                                       chapter.scheduledTime
//                                     );

//                                     const isLiveNow =
//                                       chapter.isLive &&
//                                       chapter.scheduledTime &&
//                                       new Date(chapter.scheduledTime) <=
//                                         new Date();

//                                     return (
//                                       <div
//                                         key={chapter._id}
//                                         className="flex items-center justify-between py-2 border-b last:border-0"
//                                       >
//                                         <div className="flex items-center gap-3">
//                                           <div className="flex-shrink-0">
//                                             {isScheduledLive ? (
//                                               <Calendar className="h-5 w-5 text-orange-500" />
//                                             ) : isLiveNow ? (
//                                               <Radio className="h-5 w-5 text-red-500" />
//                                             ) : (
//                                               <Video className="h-5 w-5 text-blue-500" />
//                                             )}
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">
//                                               {chapter.order}. {chapter.title}
//                                             </p>
//                                             {chapter.isLive &&
//                                               chapter.scheduledTime &&
//                                               new Date(chapter.scheduledTime) >
//                                                 new Date() && (
//                                                 <p className="text-xs text-muted-foreground">
//                                                   Scheduled:{" "}
//                                                   {new Date(
//                                                     chapter.scheduledTime
//                                                   ).toLocaleDateString()}{" "}
//                                                   at{" "}
//                                                   {new Date(
//                                                     chapter.scheduledTime
//                                                   ).toLocaleTimeString([], {
//                                                     hour: "2-digit",
//                                                     minute: "2-digit",
//                                                   })}
//                                                   <CountdownTimer
//                                                     scheduledTime={
//                                                       chapter.scheduledTime
//                                                     }
//                                                   />
//                                                 </p>
//                                               )}
//                                             {isLiveNow && (
//                                               <p className="text-xs text-red-500">
//                                                 Live session in progress
//                                               </p>
//                                             )}
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center text-sm text-muted-foreground">
//                                           <Clock className="h-4 w-4 mr-1" />
//                                           <span>{chapterDurationMinutes}m</span>
//                                         </div>
//                                       </div>
//                                     );
//                                   }
//                                 )}
//                               </div> */}
//                               <div className="mt-4 space-y-2">
//                                 {console.log(
//                                   "Total chapters:",
//                                   sortedChapters.length
//                                 )}

//                                 {sortedChapters.map(
//                                   (chapter: any, chapterIndex: number) => {
//                                     const chapterDurationMinutes = Math.ceil(
//                                       chapter.duration / 60
//                                     );
//                                     const isScheduledLive =
//                                       chapter.isLive &&
//                                       chapter.scheduledTime &&
//                                       new Date(chapter.scheduledTime) >
//                                         new Date();

//                                     console.log(
//                                       "Chapter:",
//                                       chapter.title,
//                                       "isLive:",
//                                       chapter.isLive,
//                                       "scheduledTime:",
//                                       chapter.scheduledTime
//                                     );
//                                     console.log(
//                                       "Chapter:",
//                                       chapter.title,
//                                       "isScheduledLive:",
//                                       isScheduledLive
//                                     );

//                                     const isLiveNow =
//                                       chapter.isLive &&
//                                       chapter.scheduledTime &&
//                                       new Date(chapter.scheduledTime) <=
//                                         new Date();

//                                     console.log(
//                                       "Chapter:",
//                                       chapter.title,
//                                       "isLiveNow:",
//                                       isLiveNow
//                                     );

//                                     return (
//                                       <div
//                                         key={chapter._id}
//                                         className="flex items-center justify-between py-2 border-b last:border-0"
//                                       >
//                                         <div className="flex items-center gap-3">
//                                           <div className="flex-shrink-0">
//                                             {isScheduledLive ? (
//                                               <>
//                                                 {console.log(
//                                                   "Rendering icon for:",
//                                                   chapter.title,
//                                                   "Type: Scheduled"
//                                                 )}
//                                                 <Calendar className="h-5 w-5 text-orange-500" />
//                                               </>
//                                             ) : isLiveNow ? (
//                                               <>
//                                                 {console.log(
//                                                   "Rendering icon for:",
//                                                   chapter.title,
//                                                   "Type: Live"
//                                                 )}
//                                                 <Radio className="h-5 w-5 text-red-500" />
//                                               </>
//                                             ) : (
//                                               <>
//                                                 {console.log(
//                                                   "Rendering icon for:",
//                                                   chapter.title,
//                                                   "Type: Video"
//                                                 )}
//                                                 <Video className="h-5 w-5 text-blue-500" />
//                                               </>
//                                             )}
//                                           </div>
//                                           <div>
//                                             <p className="font-medium">
//                                               {chapter.order}. {chapter.title}
//                                             </p>
//                                             {isScheduledLive && (
//                                               <>
//                                                 {console.log(
//                                                   "Rendering CountdownTimer for:",
//                                                   chapter.title,
//                                                   "at",
//                                                   chapter.scheduledTime
//                                                 )}
//                                                 <p className="text-xs text-muted-foreground">
//                                                   Scheduled:{" "}
//                                                   {new Date(
//                                                     chapter.scheduledTime
//                                                   ).toLocaleDateString()}{" "}
//                                                   at{" "}
//                                                   {new Date(
//                                                     chapter.scheduledTime
//                                                   ).toLocaleTimeString([], {
//                                                     hour: "2-digit",
//                                                     minute: "2-digit",
//                                                   })}
//                                                   <CountdownTimer
//                                                     scheduledTime={
//                                                       chapter.scheduledTime
//                                                     }
//                                                   />
//                                                 </p>
//                                               </>
//                                             )}
//                                             {isLiveNow && (
//                                               <p className="text-xs text-red-500">
//                                                 Live session in progress
//                                               </p>
//                                             )}
//                                           </div>
//                                         </div>
//                                         <div className="flex items-center text-sm text-muted-foreground">
//                                           <Clock className="h-4 w-4 mr-1" />
//                                           <span>{chapterDurationMinutes}m</span>
//                                         </div>
//                                       </div>
//                                     );
//                                   }
//                                 )}
//                               </div>
//                               ;
//                             </div>
//                           </AccordionContent>
//                         </AccordionItem>
//                       );
//                     })
//                   }
//                 </Accordion>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card className="sticky top-4">
//               <CardContent className="p-6">
//                 <div className="aspect-video rounded-lg overflow-hidden mb-4">
//                   <VideoPlayer
//                     url={course.promoVideo}
//                     thumbnail={course.thumbnail}
//                   />
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
//                   <Button className="w-full" size="lg" asChild>
//                     <Link
//                       href={{
//                         pathname: `/courses/${course._id}/${course.slug}/enroll`,
//                         query: { data: JSON.stringify(enrollmentProps) },
//                       }}
//                       href={`/courses/${course._id}/${course.slug}/enroll`}
//                     >
//                       Enroll Now
//                     </Link>
//                   </Button>
//                   <p className="text-sm text-center text-muted-foreground">
//                     30-day money-back guarantee
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>What You&apos;ll Learn</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-3">
//                   {sortedSections
//                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                     .flatMap(
//                       (section: any) =>
//                         section.whatYoullLearn?.slice(0, 2) || []
//                     )
//                     .slice(0, 6)
//                     .map((item: string, idx: number) => (
//                       <li key={idx} className="flex items-start">
//                         <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                 </ul>
//                 <Button variant="link" className="mt-4 p-0 h-auto">
//                   Show more <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>This Course Includes</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-3">
//                   <li className="flex items-center">
//                     <Video className="h-5 w-5 text-muted-foreground mr-2" />
//                     <span>
//                       {totalContentHours}h {totalContentMinutes}m on-demand
//                       video
//                     </span>
//                   </li>
//                   <li className="flex items-center">
//                     <FileText className="h-5 w-5 text-muted-foreground mr-2" />
//                     <span>{totalChapters} chapters</span>
//                   </li>
//                   {course.certificate && (
//                     <li className="flex items-center">
//                       <Award className="h-5 w-5 text-muted-foreground mr-2" />
//                       <span>Certificate of completion</span>
//                     </li>
//                   )}
//                   <li className="flex items-center">
//                     <Radio className="h-5 w-5 text-muted-foreground mr-2" />
//                     <span>Live sessions with instructor</span>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         <Separator />

//         <Card>
//           <CardHeader>
//             <CardTitle>Prerequisites</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="list-disc pl-5 space-y-2">
//               {course.prerequisites?.map(
//                 (prerequisite: string, idx: number) => (
//                   <li key={idx}>{prerequisite}</li>
//                 )
//               )}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
