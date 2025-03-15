// // "use client";

// // import { useRouter } from "next/navigation";
// // import { Button } from "@/components/ui/button";
// // import { Progress } from "@/components/ui/progress";
// // import { Badge } from "@/components/ui/badge";
// // import { CheckCircle2, Clock, Radio, Calendar, Video } from "lucide-react";
// // import { Navbar } from "@/components/client/Navbar";

// // export default function CourseDetailsEnrolled({
// //   course,
// //   user,
// // }: {
// //   course: any;
// //   user: any;
// // }) {
// //   const router = useRouter();

// //   // Sort sections by order
// //   const sortedSections = [...(course.sections || [])].sort(
// //     (a, b) => a.order - b.order
// //   );

// //   // Calculate course progress (in a real app, fetch from database)
// //   const totalChapters = sortedSections.reduce(
// //     (acc: number, section: any) => acc + (section.chapters?.length || 0),
// //     0
// //   );
// //   const completedChapters = 0; // TODO: Fetch from user progress
// //   const progress =
// //     totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

// //   // Find first chapter to start with
// //   const firstSection = sortedSections[0];
// //   const firstChapter = firstSection?.chapters?.sort(
// //     (a: any, b: any) => a.order - b.order
// //   )[0];

// //   const handleStartCourse = () => {
// //     if (firstChapter) {
// //       router.push(`/courses/${course._id}/${course.slug}/${firstChapter._id}`);
// //     }
// //   };

// //   const handleContinueLearning = () => {
// //     // In a real app, you'd find the last accessed chapter
// //     // For now, just go to the first chapter
// //     if (firstChapter) {
// //       router.push(`/courses/${course._id}/${course.slug}/${firstChapter._id}`);
// //     }
// //   };

// //   // console.log(`Course: ${course.toString()}\nUser: ${user}`);
// //   // console.log(course);
// //   console.log(JSON.stringify(course, null, 2));
// //   console.log(JSON.stringify(user, null, 2));

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="min-h-screen bg-background p-4 md:p-8">
// //         <div className="max-w-6xl mx-auto space-y-8">
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //             <div>
// //               <h1 className="text-3xl font-bold">{course.name}</h1>
// //               <p className="text-muted-foreground">
// //                 {course.instructor?.user?.name || "Unknown Instructor"}
// //               </p>
// //             </div>
// //             <div className="flex flex-col sm:flex-row gap-2">
// //               <Button onClick={handleContinueLearning}>
// //                 Continue Learning
// //               </Button>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="md:col-span-2 space-y-6">
// //               <div className="bg-muted rounded-lg p-6">
// //                 <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
// //                 <Progress value={progress} className="mb-2" />
// //                 <div className="flex justify-between text-sm">
// //                   <span>{progress.toFixed(0)}% complete</span>
// //                   <span>
// //                     {completedChapters}/{totalChapters} chapters
// //                   </span>
// //                 </div>
// //               </div>

// //               <div className="space-y-4">
// //                 <h2 className="text-xl font-semibold">Course Content</h2>
// //                 <div className="space-y-6">
// //                   {sortedSections.map((section: any) => {
// //                     // Sort chapters by order
// //                     const sortedChapters = [...(section.chapters || [])].sort(
// //                       (a, b) => a.order - b.order
// //                     );

// //                     return (
// //                       <div key={section._id} className="space-y-2">
// //                         <div className="flex items-center justify-between">
// //                           <h3 className="font-medium">
// //                             Section {section.order}: {section.title}
// //                           </h3>
// //                           <Badge variant="outline">
// //                             {sortedChapters.length} chapters
// //                           </Badge>
// //                         </div>
// //                         <div className="pl-4 space-y-2 border-l">
// //                           {sortedChapters.map((chapter: any) => {
// //                             const isLive = chapter.isLive;
// //                             const isScheduled =
// //                               // isLive &&
// //                               chapter.scheduledTime &&
// //                               new Date(chapter.scheduledTime) > new Date();
// //                             const isLiveNow =
// //                               isLive &&
// //                               chapter.scheduledTime &&
// //                               new Date(chapter.scheduledTime) <= new Date();
// //                             const chapterDurationMinutes = Math.ceil(
// //                               chapter.duration / 60
// //                             );

// //                             return (
// //                               <Button
// //                                 key={chapter._id}
// //                                 variant="ghost"
// //                                 className="w-full justify-start h-auto py-2 px-3"
// //                                 onClick={() =>
// //                                   router.push(
// //                                     `/courses/${course._id}/${course.slug}/section/${section.order}/chapter/${chapter._id}`
// //                                   )
// //                                 }
// //                               >
// //                                 <div className="flex items-center gap-2 w-full">
// //                                   <div className="flex-shrink-0">
// //                                     {chapter.completed ? (
// //                                       <CheckCircle2 className="h-4 w-4 text-green-500" />
// //                                     ) : isScheduled ? (
// //                                       <Calendar className="h-4 w-4 text-orange-500" />
// //                                     ) : isLiveNow ? (
// //                                       <Radio className="h-4 w-4 text-red-500" />
// //                                     ) : (
// //                                       <Video className="h-4 w-4" />
// //                                     )}
// //                                   </div>
// //                                   <div className="flex-1 text-left">
// //                                     <div className="font-medium">
// //                                       {chapter.title}
// //                                     </div>
// //                                     {isScheduled && (
// //                                       <div className="text-xs text-orange-500">
// //                                         Scheduled:{" "}
// //                                         {new Date(
// //                                           chapter.scheduledTime
// //                                         ).toLocaleDateString()}{" "}
// //                                         at{" "}
// //                                         {new Date(
// //                                           chapter.scheduledTime
// //                                         ).toLocaleTimeString([], {
// //                                           hour: "2-digit",
// //                                           minute: "2-digit",
// //                                         })}
// //                                       </div>
// //                                     )}
// //                                     {isLiveNow && (
// //                                       <div className="text-xs text-red-500">
// //                                         Live now
// //                                       </div>
// //                                     )}
// //                                   </div>
// //                                   <div className="flex items-center text-xs text-muted-foreground">
// //                                     <Clock className="h-3 w-3 mr-1" />
// //                                     <span>{chapterDurationMinutes}m</span>
// //                                   </div>
// //                                 </div>
// //                               </Button>
// //                             );
// //                           })}
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="space-y-6">
// //               <div className="bg-muted rounded-lg p-6">
// //                 <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
// //                 <div className="space-y-2">
// //                   <Button className="w-full" onClick={handleStartCourse}>
// //                     Start Course
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     className="w-full"
// //                     onClick={() =>
// //                       router.push(
// //                         `/courses/${course._id}/${course.slug}/resources`
// //                       )
// //                     }
// //                   >
// //                     Course Resources
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     className="w-full"
// //                     onClick={() =>
// //                       router.push(
// //                         `/courses/${course._id}/${course.slug}/discussions`
// //                       )
// //                     }
// //                   >
// //                     Discussions
// //                   </Button>
// //                 </div>
// //               </div>

// //               <div className="bg-muted rounded-lg p-6">
// //                 <h2 className="text-xl font-semibold mb-4">Course Details</h2>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">Instructor</span>
// //                     <span>{course.instructor?.user?.name}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">Level</span>
// //                     <span>{course.level}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">Duration</span>
// //                     <span>{course.totalHours} hours</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">Chapters</span>
// //                     <span>{totalChapters} chapters</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-muted-foreground">Certificate</span>
// //                     <span>{course.certificate ? "Yes" : "No"}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Clock, GraduationCap, BarChart, Languages, Radio } from "lucide-react";
// import Image from "next/image";

// export default function CoursePreview({ course }: { course: any }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const isAnyChapterLive = course.sections.some((section: any) =>
//     section.chapters.some((chapter: any) => chapter.isLive)
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <div className="relative h-[40vh] min-h-[400px] w-full bg-black">
//         <video
//           className="absolute inset-0 w-full h-full object-cover opacity-50"
//           autoPlay
//           muted
//           loop
//           playsInline
//           src={course.promoVideo}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
//         <div className="relative h-full max-w-6xl mx-auto px-4 flex items-end pb-8">
//           <div className="space-y-4">
//             {isAnyChapterLive && (
//               <div className="flex items-center gap-2">
//                 <span className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                 </span>
//                 <span className="text-red-500 font-medium">Live Now</span>
//               </div>
//             )}
//             <h1 className="text-4xl md:text-5xl font-bold text-white">
//               {course.name}
//             </h1>
//             <p className="text-lg text-gray-200 max-w-2xl">
//               {course.description}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Course Content */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             <Tabs defaultValue="overview" className="w-full">
//               <TabsList>
//                 <TabsTrigger value="overview">Overview</TabsTrigger>
//                 <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
//                 <TabsTrigger value="instructor">Instructor</TabsTrigger>
//               </TabsList>
//               <TabsContent value="overview" className="space-y-4">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <Card className="p-4">
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-primary" />
//                       <div className="text-sm">
//                         <p className="font-medium">{course.totalHours} Hours</p>
//                         <p className="text-muted-foreground">Duration</p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="p-4">
//                     <div className="flex items-center gap-2">
//                       <GraduationCap className="h-4 w-4 text-primary" />
//                       <div className="text-sm">
//                         <p className="font-medium">{course.level}</p>
//                         <p className="text-muted-foreground">Level</p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="p-4">
//                     <div className="flex items-center gap-2">
//                       <Languages className="h-4 w-4 text-primary" />
//                       <div className="text-sm">
//                         <p className="font-medium capitalize">
//                           {course.language}
//                         </p>
//                         <p className="text-muted-foreground">Language</p>
//                       </div>
//                     </div>
//                   </Card>
//                   <Card className="p-4">
//                     <div className="flex items-center gap-2">
//                       <BarChart className="h-4 w-4 text-primary" />
//                       <div className="text-sm">
//                         <p className="font-medium">
//                           {course.enrolledStudents.length}
//                         </p>
//                         <p className="text-muted-foreground">Students</p>
//                       </div>
//                     </div>
//                   </Card>
//                 </div>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Tags</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {course.tags.map((tag: string) => (
//                       <Badge key={tag} variant="secondary">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </TabsContent>
//               <TabsContent value="curriculum">
//                 <ScrollArea className="h-[600px] pr-4">
//                   {course.sections.map((section: any) => (
//                     <div key={section._id} className="mb-6">
//                       <h3 className="text-lg font-semibold mb-2">
//                         {section.title}
//                       </h3>
//                       <p className="text-muted-foreground mb-4">
//                         {section.description}
//                       </p>
//                       <div className="space-y-2">
//                         {section.chapters.map((chapter: any) => (
//                           <Card key={chapter._id} className="p-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 {chapter.isLive && (
//                                   <span className="relative flex h-3 w-3">
//                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                                     <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
//                                   </span>
//                                 )}
//                                 <div>
//                                   <p className="font-medium">{chapter.title}</p>
//                                   <p className="text-sm text-muted-foreground">
//                                     {chapter.description}
//                                   </p>
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 {chapter.lectureType === "liveLecture" ? (
//                                   <Badge variant="secondary">
//                                     <Radio className="h-3 w-3 mr-1" />
//                                     Live
//                                   </Badge>
//                                 ) : (
//                                   <Badge variant="secondary">
//                                     {chapter.duration} mins
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </ScrollArea>
//               </TabsContent>
//               <TabsContent value="instructor">
//                 <Card className="p-6">
//                   <div className="flex items-start gap-4">
//                     <Avatar className="h-16 w-16">
//                       <AvatarImage
//                         src={course.instructor.user.avatarUrl}
//                         alt={course.instructor.user.name}
//                       />
//                       <AvatarFallback>
//                         {course.instructor.user.name
//                           .split(" ")
//                           .map((n: string) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="space-y-2">
//                       <div>
//                         <h3 className="text-lg font-semibold">
//                           {course.instructor.title}{" "}
//                           {course.instructor.user.name}
//                         </h3>
//                         <p className="text-muted-foreground">
//                           {course.instructor.expertise.join(", ")}
//                         </p>
//                       </div>
//                       <p>{course.instructor.bio}</p>
//                       <div>
//                         <h4 className="font-medium mb-2">Qualifications</h4>
//                         <ul className="list-disc list-inside text-sm text-muted-foreground">
//                           {course.instructor.qualifications.map(
//                             (qual: any, index: number) => (
//                               <li key={index}>
//                                 {qual.degree} from {qual.institution} (
//                                 {qual.year})
//                               </li>
//                             )
//                           )}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>

//           {/* Sidebar */}
//           <div>
//             <Card className="sticky top-4">
//               <div className="aspect-video relative">
//                 <Image
//                   src={course.thumbnail || "/placeholder.svg"}
//                   alt={course.name}
//                   fill
//                   className="object-cover rounded-t-lg"
//                 />
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="flex items-baseline justify-between">
//                   <span className="text-3xl font-bold">₹{course.price}</span>
//                   <Badge variant="secondary">{course.status}</Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <Button className="w-full" size="lg">
//                     Enroll Now
//                   </Button>
//                   <p className="text-xs text-center text-muted-foreground">
//                     Class Code: {course.classCode}
//                   </p>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       Total Sections
//                     </span>
//                     <span>{course.sections.length}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">
//                       Total Duration
//                     </span>
//                     <span>{course.totalHours} hours</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Certificate</span>
//                     <span>{course.certificate ? "Yes" : "No"}</span>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  GraduationCap,
  BarChart,
  Languages,
  Radio,
  Play,
  Calendar,
  Star,
  Edit,
  Trash2,
  CheckCircle2,
  Video,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { toast } from "@/hooks/use-toast";
import { Navbar } from "@/components/client/Navbar";

// Mock user progress data - in a real app, this would come from the database
const mockUserProgress = {
  completedChapters: ["67cff7e341890f2f00fab66d"],
  lastWatchedChapter: "67cff7e341890f2f00fab66d",
  progress: 25, // percentage
};

// Mock reviews data - in a real app, this would come from the database
const mockReviews = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Great course! I learned a lot about NextJS fundamentals.",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment:
      "Very informative content, but some sections could be more detailed.",
    createdAt: new Date("2025-03-08"),
  },
];

// Helper function to format seconds to hours and minutes
const formatDuration = (seconds: number) => {
  if (!seconds) return "0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Star Rating Component
const StarRating = ({
  rating,
  onChange,
  interactive = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= (hoverRating || rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default function CourseEnrolledView({ course }: { course: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userProgress, setUserProgress] = useState(mockUserProgress);
  const [reviews, setReviews] = useState(mockReviews);
  const [userReview, setUserReview] = useState<any>(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReview, setEditingReview] = useState({
    rating: 0,
    comment: "",
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Find the last watched chapter
  const lastWatchedChapter = course.sections
    .flatMap((section: any) => section.chapters)
    .find((chapter: any) => chapter._id === userProgress.lastWatchedChapter);

  // Calculate total chapters and completed chapters
  const totalChapters = course.sections.reduce(
    (acc: number, section: any) => acc + section.chapters.length,
    0
  );

  // Check if any chapter is live now
  const isAnyChapterLive = course.sections.some((section: any) =>
    section.chapters.some((chapter: any) => chapter.isLive)
  );

  // Convert total duration from seconds to hours
  const totalHoursDisplay = formatDuration(course.totalHours);

  useEffect(() => {
    setMounted(true);

    // In a real app, fetch user progress and reviews from API
    const fetchUserData = async () => {
      try {
        // const progressResponse = await fetch(`/api/courses/${course._id}/progress`);
        // const progressData = await progressResponse.json();
        // setUserProgress(progressData);
        // const reviewsResponse = await fetch(`/api/courses/${course._id}/reviews`);
        // const reviewsData = await reviewsResponse.json();
        // setReviews(reviewsData);
        // Check if user has already submitted a review
        // const userReview = reviewsData.find(r => r.userId === currentUser.id);
        // if (userReview) {
        //   setUserReview(userReview);
        // }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // fetchUserData();
  }, [course._id]);

  if (!mounted) return null;

  const handleContinueLearning = () => {
    if (lastWatchedChapter) {
      // Find the section that contains the last watched chapter
      const section = course.sections.find((s: any) =>
        s.chapters.some((c: any) => c._id === lastWatchedChapter._id)
      );

      if (section) {
        router.push(
          `/courses/${course._id}/${course.slug}/section/${section.order}/chapter/${lastWatchedChapter._id}`
        );
      }
    } else {
      // If no last watched chapter, start from the first chapter
      const firstSection = course.sections[0];
      const firstChapter = firstSection?.chapters[0];

      if (firstChapter) {
        router.push(
          `/courses/${course._id}/${course.slug}/section/${firstSection.order}/chapter/${firstChapter._id}`
        );
      }
    }
  };

  const handleStartCourse = () => {
    const firstSection = course.sections[0];
    const firstChapter = firstSection?.chapters[0];

    if (firstChapter) {
      router.push(
        `/courses/${course._id}/${course.slug}/section/${firstSection.order}/chapter/${firstChapter._id}`
      );
    }
  };

  const handleChapterClick = (sectionOrder: number, chapterId: string) => {
    router.push(
      `/courses/${course._id}/${course.slug}/section/${sectionOrder}/chapter/${chapterId}`
    );
  };

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, send to API
      // const response = await fetch(`/api/courses/${course._id}/reviews`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newReview),
      // });

      // if (!response.ok) throw new Error("Failed to submit review");

      // const data = await response.json();

      // Mock response
      const mockResponse = {
        id: Date.now().toString(),
        userId: "currentUser",
        userName: "Current User",
        userAvatar: "/placeholder.svg?height=40&width=40",
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date(),
      };

      setReviews([mockResponse, ...reviews]);
      setUserReview(mockResponse);
      setNewReview({ rating: 0, comment: "" });

      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReview = async () => {
    if (!userReview) return;

    try {
      // In a real app, send to API
      // const response = await fetch(`/api/courses/${course._id}/reviews/${userReview.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(editingReview),
      // });

      // if (!response.ok) throw new Error("Failed to update review");

      // const data = await response.json();

      // Update local state
      const updatedReviews = reviews.map((review) =>
        review.id === userReview.id
          ? {
              ...review,
              rating: editingReview.rating,
              comment: editingReview.comment,
            }
          : review
      );

      setReviews(updatedReviews);
      setUserReview({
        ...userReview,
        rating: editingReview.rating,
        comment: editingReview.comment,
      });

      toast({
        title: "Success",
        description: "Your review has been updated",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      // In a real app, send to API
      // const response = await fetch(`/api/courses/${course._id}/reviews/${userReview.id}`, {
      //   method: "DELETE",
      // });

      // if (!response.ok) throw new Error("Failed to delete review");

      // Update local state
      const updatedReviews = reviews.filter(
        (review) => review.id !== userReview.id
      );
      setReviews(updatedReviews);
      setUserReview(null);

      toast({
        title: "Success",
        description: "Your review has been deleted",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[300px] w-full bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            autoPlay
            muted
            loop
            playsInline
            src={course.promoVideo}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="relative h-full max-w-6xl mx-auto px-4 flex items-end pb-8">
            <div className="space-y-4">
              {isAnyChapterLive && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-red-500 font-medium">Live Now</span>
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {course.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={course.instructor.user.avatarUrl}
                    alt={course.instructor.user.name}
                  />
                  <AvatarFallback>
                    {course.instructor.user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{course.instructor.user.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <span className="text-sm text-muted-foreground">
                {userProgress.completedChapters.length}/{totalChapters} chapters
                completed
              </span>
            </div>
            <Progress value={userProgress.progress} className="h-2" />
          </div>

          {/* Continue Learning Card */}
          {lastWatchedChapter && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Continue Learning</h3>
                    <p className="text-muted-foreground">
                      {lastWatchedChapter.title}
                    </p>
                  </div>
                  <Button onClick={handleContinueLearning}>
                    <Play className="mr-2 h-4 w-4" /> Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="curriculum" className="w-full">
                <TabsList>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="curriculum">
                  <ScrollArea className="h-[600px] pr-4">
                    {course.sections.map((section: any) => (
                      <div key={section._id} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">
                            Section {section.order}: {section.title}
                          </h3>
                          <Badge variant="outline">
                            {section.chapters.length} chapters
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {section.description}
                        </p>
                        <div className="space-y-2 border-l pl-4">
                          {section.chapters.map((chapter: any) => {
                            const isCompleted =
                              userProgress.completedChapters.includes(
                                chapter._id
                              );
                            const isLive = chapter.isLive;
                            const isScheduled =
                              chapter.lectureType === "liveLecture" &&
                              chapter.scheduledTime &&
                              new Date(chapter.scheduledTime) > new Date();
                            const isLiveNow =
                              isLive &&
                              chapter.scheduledTime &&
                              new Date(chapter.scheduledTime) <= new Date();

                            return (
                              <Button
                                key={chapter._id}
                                variant="ghost"
                                className="w-full justify-start h-auto py-3 px-4 hover:bg-muted"
                                onClick={() =>
                                  handleChapterClick(section.order, chapter._id)
                                }
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : isLiveNow ? (
                                      <div className="relative">
                                        <Radio className="h-5 w-5 text-red-500" />
                                        <span className="absolute top-0 right-0 flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                      </div>
                                    ) : isScheduled ? (
                                      <Calendar className="h-5 w-5 text-orange-500" />
                                    ) : (
                                      <Video className="h-5 w-5" />
                                    )}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="font-medium">
                                      {chapter.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {chapter.description.substring(0, 60)}
                                      {chapter.description.length > 60
                                        ? "..."
                                        : ""}
                                    </div>
                                    {isScheduled && (
                                      <div className="text-xs text-orange-500 mt-1">
                                        Scheduled:{" "}
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
                                      </div>
                                    )}
                                    {isLiveNow && (
                                      <div className="text-xs text-red-500 mt-1 font-medium">
                                        Live now
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {formatDuration(chapter.duration)}
                                    </span>
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="instructor">
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={course.instructor.user.avatarUrl}
                          alt={course.instructor.user.name}
                        />
                        <AvatarFallback>
                          {course.instructor.user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {course.instructor.title}{" "}
                            {course.instructor.user.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {course.instructor.expertise.join(", ")}
                          </p>
                        </div>
                        <p>{course.instructor.bio}</p>
                        <div>
                          <h4 className="font-medium mb-2">Qualifications</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {course.instructor.qualifications.map(
                              (qual: any, index: number) => (
                                <li key={index}>
                                  {qual.degree} from {qual.institution} (
                                  {qual.year})
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-6">
                    {/* Add/Edit Review */}
                    <Card className="p-6">
                      {!userReview ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Write a Review
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span>Rating:</span>
                              <StarRating
                                rating={newReview.rating}
                                onChange={(rating) =>
                                  setNewReview({ ...newReview, rating })
                                }
                                interactive={true}
                              />
                            </div>
                            <Textarea
                              placeholder="Share your experience with this course..."
                              value={newReview.comment}
                              onChange={(e) =>
                                setNewReview({
                                  ...newReview,
                                  comment: e.target.value,
                                })
                              }
                              className="min-h-[100px]"
                            />
                          </div>
                          <Button onClick={handleSubmitReview}>
                            Submit Review
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              Your Review
                            </h3>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Your Review</DialogTitle>
                                    <DialogDescription>
                                      Update your rating and feedback for this
                                      course.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <span>Rating:</span>
                                      <StarRating
                                        rating={
                                          editingReview.rating ||
                                          userReview.rating
                                        }
                                        onChange={(rating) =>
                                          setEditingReview({
                                            ...editingReview,
                                            rating,
                                          })
                                        }
                                        interactive={true}
                                      />
                                    </div>
                                    <Textarea
                                      placeholder="Share your experience with this course..."
                                      value={
                                        editingReview.comment ||
                                        userReview.comment
                                      }
                                      onChange={(e) =>
                                        setEditingReview({
                                          ...editingReview,
                                          comment: e.target.value,
                                        })
                                      }
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button onClick={handleUpdateReview}>
                                        Save Changes
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Review
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete your
                                      review? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteReview}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <StarRating rating={userReview.rating} />
                              <span className="text-sm text-muted-foreground">
                                {new Date(
                                  userReview.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p>{userReview.comment}</p>
                          </div>
                        </div>
                      )}
                    </Card>

                    {/* Other Reviews */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Student Reviews</h3>
                      {reviews.length > 0 ? (
                        reviews
                          .filter(
                            (review) =>
                              !userReview || review.id !== userReview.id
                          )
                          .map((review) => (
                            <Card key={review.id} className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={review.userAvatar}
                                    alt={review.userName}
                                  />
                                  <AvatarFallback>
                                    {review.userName
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">
                                      {review.userName}
                                    </h4>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <StarRating rating={review.rating} />
                                  </div>
                                  <p className="mt-2 text-sm">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">
                          No reviews yet. Be the first to review this course!
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-4 space-y-6">
                <Card>
                  <div className="aspect-video relative">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Clock className="h-5 w-5 text-primary mb-1" />
                        <span className="text-sm font-medium">
                          {totalHoursDisplay}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Duration
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary mb-1" />
                        <span className="text-sm font-medium">
                          {course.level}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Level
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Languages className="h-5 w-5 text-primary mb-1" />
                        <span className="text-sm font-medium capitalize">
                          {course.language}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Language
                        </span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <BarChart className="h-5 w-5 text-primary mb-1" />
                        <span className="text-sm font-medium">
                          {course.enrolledStudents.length}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Students
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={handleContinueLearning}
                      >
                        Continue Learning
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleStartCourse}
                      >
                        Start from Beginning
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Certificate
                        </span>
                        <span>{course.certificate ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Sections
                        </span>
                        <span>{course.sections.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Chapters
                        </span>
                        <span>{totalChapters}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        router.push(
                          `/courses/${course._id}/${course.slug}/resources`
                        )
                      }
                    >
                      Course Resources
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        router.push(
                          `/courses/${course._id}/${course.slug}/discussions`
                        )
                      }
                    >
                      Discussions
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        router.push(
                          `/courses/${course._id}/${course.slug}/notes`
                        )
                      }
                    >
                      My Notes
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
