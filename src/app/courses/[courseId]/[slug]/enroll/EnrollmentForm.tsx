// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { Badge } from "@/components/ui/badge";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { PaymentButton } from "@/components/client/PaymentButton";
// import { Separator } from "@/components/ui/separator";
// import { Check, Clock, FileText, Users, ArrowLeft } from "lucide-react";
// import Image from "next/image";

// interface EnrollmentFormProps {
//   courseDetails: any;
//   user: any;
//   classCodeFromUrl?: string;
// }

// export default function EnrollmentForm({
//   courseDetails,
//   user,
//   classCodeFromUrl,
// }: EnrollmentFormProps) {
//   const [classCode, setClassCode] = useState(classCodeFromUrl || "");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     // If class code is provided in URL, attempt enrollment automatically
//     if (classCodeFromUrl) {
//       handleClassCodeSubmit(new Event("submit") as any);
//     }
//   }, [classCodeFromUrl]);

//   const handleClassCodeSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     console.log("Course Details:", courseDetails);

//     try {
//       const response = await fetch("/api/enroll/class-code", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           courseId: courseDetails._id,
//           classCode,
//         }),
//       });

//       if (response.ok) {
//         toast.success("Successfully enrolled in the course!");
//         router.push(`/courses/${courseDetails._id}/${courseDetails.slug}`);
//       } else {
//         const data = await response.json();
//         toast.error(data.message || "Failed to enroll. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container max-w-7xl mx-auto py-8 px-4">
//       <div className="container max-w-7xl mx-auto py-8 px-4">
//         <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Course
//         </Button>

//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex-shrink-0">
//             <Image
//               src={courseDetails.instructor.avatarUrl || "/placeholder.svg"}
//               alt={courseDetails.instructor.name}
//               width={64}
//               height={64}
//               className="rounded-full"
//             />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold mb-2">{courseDetails.name}</h1>
//             <p className="text-muted-foreground">
//               by {courseDetails.instructor.title}{" "}
//               {courseDetails.instructor.name}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2 mb-8">
//           <Badge>{courseDetails.level}</Badge>
//           <Badge variant="outline">{courseDetails.language}</Badge>
//           <Badge variant="secondary">{courseDetails.totalHours} hours</Badge>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Left Section - Class Code */}
//           <Card className="lg:col-span-4">
//             <CardHeader>
//               <CardTitle>Have a Class Code?</CardTitle>
//               <CardDescription>
//                 Enter your class code to get instant access to the course.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleClassCodeSubmit}>
//                 <Input
//                   type="text"
//                   placeholder="Enter class code"
//                   value={classCode}
//                   onChange={(e) => setClassCode(e.target.value)}
//                   className="mb-4"
//                 />
//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? "Enrolling..." : "Enroll with Code"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Right Section - Payment */}
//           <div className="lg:col-span-8">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Course Details</CardTitle>
//                 <CardDescription>
//                   Get full access to all course content and features
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid gap-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm font-medium">Duration</p>
//                         <p className="text-sm text-muted-foreground">
//                           {courseDetails.totalHours} hours
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Users className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm font-medium">Enrolled</p>
//                         <p className="text-sm text-muted-foreground">
//                           {courseDetails.enrolledStudents} students
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <h3 className="text-lg font-semibold mb-3">
//                       Course Content
//                     </h3>
//                     <div className="grid gap-2">
//                       {/* {courseDetails.chapters
//                       .slice(0, 3)
//                       .map((chapter, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between"
//                         >
//                           <div className="flex items-center gap-2">
//                             <FileText className="h-4 w-4 text-muted-foreground" />
//                             <span className="text-sm">{chapter.title}</span>
//                           </div>
//                           <span className="text-sm text-muted-foreground">
//                             {chapter.duration} min
//                           </span>
//                         </div>
//                       ))} */}
//                       {courseDetails?.chapters
//                         ?.slice(0, 3)
//                         .map((chapter, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center justify-between"
//                           >
//                             <div className="flex items-center gap-2">
//                               <FileText className="h-4 w-4 text-muted-foreground" />
//                               <span className="text-sm">{chapter.title}</span>
//                             </div>
//                             <span className="text-sm text-muted-foreground">
//                               {chapter.duration} min
//                             </span>
//                           </div>
//                         ))}
//                       {/*
//                     {courseDetails.chapters.length > 3 && (
//                       <p className="text-sm text-muted-foreground">
//                         + {courseDetails.chapters.length - 3} more chapters
//                       </p>
//                     )} */}
//                       {courseDetails?.chapters?.length > 3 && (
//                         <p className="text-sm text-muted-foreground">
//                           + {courseDetails.chapters.length - 3} more chapters
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <Separator />

//                   <div>
//                     <h3 className="text-lg font-semibold mb-3">
//                       What&apos;s Included
//                     </h3>
//                     <div className="grid gap-2">
//                       {courseDetails?.features?.length ? (
//                         courseDetails.features.map((feature, index) => (
//                           <div key={index} className="flex items-center gap-2">
//                             <Check className="h-4 w-4 text-green-500" />
//                             <span className="text-sm">{feature}</span>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-muted-foreground">
//                           No features available
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col gap-4">
//                 <div className="w-full">
//                   <div className="flex justify-between mb-2">
//                     <span className="text-lg">Total Price:</span>
//                     <span className="text-2xl font-bold">
//                       ₹{courseDetails.price}
//                     </span>
//                   </div>
//                   <PaymentButton
//                     courseId={courseDetails?.courseId?.toString() ?? ""}
//                     price={courseDetails?.price ?? 0}
//                     studentEmail={courseDetails?.studentEmail ?? ""}
//                   />

//                   {/* // <PaymentButton
//                     //   courseId={course._id.toString()}
//                     //   price={course.price}
//                     //   studentEmail={session?.user.email}
//                     // /> */}
//                 </div>
//                 <p className="text-sm text-muted-foreground text-center">
//                   Secure payment processed by Cashfree • 30-day money-back
//                   guarantee
//                 </p>
//               </CardFooter>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaymentButton } from "@/components/client/PaymentButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  FileText,
  Users,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface EnrollmentFormProps {
  courseDetails: any;
  user: any;
  classCodeFromUrl?: string;
}

export default function EnrollmentForm({
  courseDetails,
  user,
  classCodeFromUrl,
}: EnrollmentFormProps) {
  const [classCode, setClassCode] = useState(classCodeFromUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleClassCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) {
      toast.error("Please enter a class code");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enroll/class-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseDetails._id,
          courseSlug: courseDetails.slug,
          classCode,
        }),
      });

      if (response.ok) {
        toast.success("Successfully enrolled in the course!");
        router.push(`/courses/${courseDetails._id}/${courseDetails.slug}`);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to enroll. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format course sections and chapters for display
  const formattedChapters = courseDetails.sections?.flatMap((section: any) =>
    section.chapters?.map((chapter: any) => ({
      title: chapter.title,
      duration: Math.ceil(chapter.duration / 60), // Convert to minutes
    }))
  );

  // Course features
  const courseFeatures = [
    "Lifetime access to all content",
    "Certificate of completion",
    "Access to course community",
    "Direct instructor support",
    "Downloadable resources",
    courseDetails.certificate ? "Verified certificate" : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Image
              src={
                courseDetails.instructor?.avatarUrl ||
                "/placeholder.svg?height=64&width=64"
              }
              alt={courseDetails.instructor?.name || "Instructor"}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{courseDetails.name}</h1>
              <p className="text-muted-foreground">
                by {courseDetails.instructor?.title}{" "}
                {courseDetails.instructor?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            <Badge>{courseDetails.level}</Badge>
            <Badge variant="outline">{courseDetails.language}</Badge>
            <Badge variant="secondary">{courseDetails.totalHours} hours</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Class Code */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Have a Class Code?</CardTitle>
              <CardDescription>
                Enter your class code to get instant access to the course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClassCodeSubmit}>
                <Input
                  type="text"
                  placeholder="Enter class code"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="mb-4"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={isSubmitting || !classCode.trim()}
                    >
                      {isSubmitting ? "Enrolling..." : "Enroll with Code"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you ready to enroll in &quot;{courseDetails.name}
                        &quot;? You&apos;ll get immediate access to all course
                        content.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClassCodeSubmit}>
                        Confirm Enrollment
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </CardContent>
          </Card>

          {/* Right Section - Course Details & Payment */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Get full access to all course content and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">
                          {courseDetails.totalHours} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Enrolled</p>
                        <p className="text-sm text-muted-foreground">
                          {courseDetails.enrolledStudents?.length || 0} students
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Course Content
                    </h3>
                    {formattedChapters && formattedChapters.length > 0 ? (
                      <div className="grid gap-2">
                        {formattedChapters
                          .slice(0, 3)
                          .map((chapter: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{chapter.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {chapter.duration}m
                              </span>
                            </div>
                          ))}
                        {formattedChapters.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            + {formattedChapters.length - 3} more chapters
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        <span>No chapters available</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      What&apos;s Included
                    </h3>
                    <div className="grid gap-2">
                      {courseFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-lg">Total Price:</span>
                    <span className="text-2xl font-bold">
                      ₹{courseDetails.price}
                    </span>
                  </div>
                  <PaymentButton
                    courseId={courseDetails._id}
                    price={courseDetails.price}
                    studentEmail={user.email}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Secure payment processed by Cashfree • 30-day money-back
                  guarantee
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
