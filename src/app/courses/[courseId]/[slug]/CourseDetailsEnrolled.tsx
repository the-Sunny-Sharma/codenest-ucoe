"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Radio, Calendar, Video } from "lucide-react";

export default function CourseDetailsEnrolled({
  course,
  user,
}: {
  course: any;
  user: any;
}) {
  const router = useRouter();

  // Sort sections by order
  const sortedSections = [...(course.sections || [])].sort(
    (a, b) => a.order - b.order
  );

  // Calculate course progress (in a real app, fetch from database)
  const totalChapters = sortedSections.reduce(
    (acc: number, section: any) => acc + (section.chapters?.length || 0),
    0
  );
  const completedChapters = 0; // TODO: Fetch from user progress
  const progress =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  // Find first chapter to start with
  const firstSection = sortedSections[0];
  const firstChapter = firstSection?.chapters?.sort(
    (a: any, b: any) => a.order - b.order
  )[0];

  const handleStartCourse = () => {
    if (firstChapter) {
      router.push(`/courses/${course._id}/${course.slug}/${firstChapter._id}`);
    }
  };

  const handleContinueLearning = () => {
    // In a real app, you'd find the last accessed chapter
    // For now, just go to the first chapter
    if (firstChapter) {
      router.push(`/courses/${course._id}/${course.slug}/${firstChapter._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">
              {course.instructor?.user?.name || "Unknown Instructor"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleContinueLearning}>Continue Learning</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              <Progress value={progress} className="mb-2" />
              <div className="flex justify-between text-sm">
                <span>{progress.toFixed(0)}% complete</span>
                <span>
                  {completedChapters}/{totalChapters} chapters
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <div className="space-y-6">
                {sortedSections.map((section: any) => {
                  // Sort chapters by order
                  const sortedChapters = [...(section.chapters || [])].sort(
                    (a, b) => a.order - b.order
                  );

                  return (
                    <div key={section._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          Section {section.order}: {section.title}
                        </h3>
                        <Badge variant="outline">
                          {sortedChapters.length} chapters
                        </Badge>
                      </div>
                      <div className="pl-4 space-y-2 border-l">
                        {sortedChapters.map((chapter: any) => {
                          const isLive = chapter.isLive;
                          const isScheduled =
                            isLive &&
                            chapter.scheduledTime &&
                            new Date(chapter.scheduledTime) > new Date();
                          const isLiveNow =
                            isLive &&
                            chapter.scheduledTime &&
                            new Date(chapter.scheduledTime) <= new Date();
                          const chapterDurationMinutes = Math.ceil(
                            chapter.duration / 60
                          );

                          return (
                            <Button
                              key={chapter._id}
                              variant="ghost"
                              className="w-full justify-start h-auto py-2 px-3"
                              onClick={() =>
                                router.push(
                                  `/courses/${course._id}/${course.slug}/${chapter._id}`
                                )
                              }
                            >
                              <div className="flex items-center gap-2 w-full">
                                <div className="flex-shrink-0">
                                  {chapter.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : isScheduled ? (
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                  ) : isLiveNow ? (
                                    <Radio className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <Video className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="font-medium">
                                    {chapter.title}
                                  </div>
                                  {isScheduled && (
                                    <div className="text-xs text-orange-500">
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
                                    <div className="text-xs text-red-500">
                                      Live now
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{chapterDurationMinutes}m</span>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button className="w-full" onClick={handleStartCourse}>
                  Start Course
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
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
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/courses/${course._id}/${course.slug}/discussions`
                    )
                  }
                >
                  Discussions
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Course Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructor</span>
                  <span>{course.instructor?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{course.totalHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chapters</span>
                  <span>{totalChapters} chapters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Certificate</span>
                  <span>{course.certificate ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
