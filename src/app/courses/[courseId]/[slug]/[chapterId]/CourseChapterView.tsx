"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/client/VideoPlayer";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Radio,
  Calendar,
  Video,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
} from "lucide-react";

// Helper function to format time remaining
const formatTimeRemaining = (scheduledTime: Date) => {
  const now = new Date();
  const timeRemaining = new Date(scheduledTime).getTime() - now.getTime();

  if (timeRemaining <= 0) return "Starting soon";

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

export default function CourseChapterView({
  course,
  user,
  activeChapterId,
}: {
  course: any;
  user: any;
  activeChapterId: string;
}) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>(
    {}
  );

  // Sort sections by order
  const sortedSections = [...(course.sections || [])].sort(
    (a, b) => a.order - b.order
  );

  // Find active section and chapter
  let activeSection = null;
  let activeChapter = null;
  let prevChapter = null;
  let nextChapter = null;

  // Create a flat list of all chapters to find prev/next
  const allChapters: any[] = [];

  sortedSections.forEach((section: any) => {
    const sortedChapters = [...(section.chapters || [])].sort(
      (a, b) => a.order - b.order
    );

    sortedChapters.forEach((chapter: any) => {
      allChapters.push({
        ...chapter,
        sectionId: section._id,
        sectionTitle: section.title,
      });
    });

    // Find active section and chapter
    const chapter = sortedChapters.find(
      (ch: any) => ch._id.toString() === activeChapterId
    );

    if (chapter) {
      activeSection = section;
      activeChapter = chapter;
    }
  });

  // Find prev and next chapters
  if (allChapters.length > 0) {
    const activeIndex = allChapters.findIndex(
      (ch) => ch._id.toString() === activeChapterId
    );

    if (activeIndex > 0) {
      prevChapter = allChapters[activeIndex - 1];
    }

    if (activeIndex < allChapters.length - 1) {
      nextChapter = allChapters[activeIndex + 1];
    }
  }

  // Calculate course progress
  const totalChapters = allChapters.length;
  const completedChapters = 0; // TODO: Fetch from user progress
  const progress =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  // Update countdown timers
  useEffect(() => {
    const updateTimers = () => {
      const newTimeRemaining: { [key: string]: string } = {};

      allChapters.forEach((chapter: any) => {
        if (chapter.isLive && chapter.scheduledTime) {
          newTimeRemaining[chapter._id] = formatTimeRemaining(
            chapter.scheduledTime
          );
        }
      });

      setTimeRemaining(newTimeRemaining);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [allChapters]);

  // Handle navigation
  const navigateToPrevChapter = () => {
    if (prevChapter) {
      router.push(`/courses/${course._id}/${course.slug}/${prevChapter._id}`);
    }
  };

  const navigateToNextChapter = () => {
    if (nextChapter) {
      router.push(`/courses/${course._id}/${course.slug}/${nextChapter._id}`);
    }
  };

  if (!activeChapter || !activeSection) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Chapter not found</h2>
          <Button
            onClick={() => router.push(`/courses/${course._id}/${course.slug}`)}
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const isLive = activeChapter.isLive;
  const isScheduled =
    isLive &&
    activeChapter.scheduledTime &&
    new Date(activeChapter.scheduledTime) > new Date();
  const isLiveNow =
    isLive &&
    activeChapter.scheduledTime &&
    new Date(activeChapter.scheduledTime) <= new Date();
  const chapterDurationMinutes = Math.ceil(activeChapter.duration / 60);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 xl:grid-cols-4 h-screen">
        {/* Course Navigation Sidebar */}
        <div className="xl:col-span-1 border-r">
          <div className="p-4 border-b">
            <h1 className="font-semibold truncate">{course.name}</h1>
            <Progress value={progress} className="mt-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {progress.toFixed(0)}% complete
            </p>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-4 space-y-6">
              {sortedSections.map((section: any) => {
                // Sort chapters by order
                const sortedChapters = [...(section.chapters || [])].sort(
                  (a, b) => a.order - b.order
                );

                return (
                  <div key={section._id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <h3 className="font-medium">{section.title}</h3>
                    </div>
                    <div className="ml-6 space-y-1">
                      {sortedChapters.map((chapter: any) => {
                        const isActive =
                          chapter._id.toString() === activeChapterId;
                        const chapterIsLive = chapter.isLive;
                        const chapterIsScheduled =
                          chapterIsLive &&
                          chapter.scheduledTime &&
                          new Date(chapter.scheduledTime) > new Date();
                        const chapterIsLiveNow =
                          chapterIsLive &&
                          chapter.scheduledTime &&
                          new Date(chapter.scheduledTime) <= new Date();

                        return (
                          <Button
                            key={chapter._id}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2 h-auto py-2"
                            onClick={() => {
                              router.push(
                                `/courses/${course._id}/${course.slug}/${chapter._id}`
                              );
                            }}
                          >
                            {chapter.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : chapterIsScheduled ? (
                              <Calendar className="h-4 w-4 text-orange-500" />
                            ) : chapterIsLiveNow ? (
                              <Radio className="h-4 w-4 text-red-500" />
                            ) : (
                              <Video className="h-4 w-4" />
                            )}
                            <div className="flex flex-col items-start">
                              <span className="text-sm">{chapter.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {chapterIsScheduled ? (
                                  <span className="text-orange-500">
                                    {timeRemaining[chapter._id]}
                                  </span>
                                ) : chapterIsLiveNow ? (
                                  <span className="text-red-500">Live now</span>
                                ) : (
                                  `${Math.ceil(chapter.duration / 60)}m`
                                )}
                              </span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-3 h-screen flex flex-col">
          {/* Video Player */}
          <div className="aspect-video bg-black">
            {isScheduled ? (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <Calendar className="h-16 w-16 mb-4 text-orange-500" />
                <h2 className="text-xl font-bold mb-2">
                  Live session scheduled
                </h2>
                <p className="mb-2">
                  {new Date(activeChapter.scheduledTime).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(activeChapter.scheduledTime).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                <Badge
                  variant="outline"
                  className="text-orange-500 border-orange-500"
                >
                  {timeRemaining[activeChapter._id]}
                </Badge>
              </div>
            ) : isLiveNow ? (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <Radio className="h-16 w-16 mb-4 text-red-500 animate-pulse" />
                <h2 className="text-xl font-bold mb-2">
                  Live session in progress
                </h2>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-red-500 hover:text-white"
                >
                  Join Live Session
                </Button>
              </div>
            ) : activeChapter.videoUrl ? (
              <VideoPlayer url={activeChapter.videoUrl} />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <Info className="h-8 w-8 mr-2" />
                <span>No video available for this chapter</span>
              </div>
            )}
          </div>

          {/* Chapter Details */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{activeChapter.title}</h2>
                  <p className="text-muted-foreground">
                    {activeSection.title} • Chapter {activeChapter.order}
                  </p>
                </div>
                <Badge variant="outline">
                  <Clock className="mr-1 h-4 w-4" />
                  {chapterDurationMinutes} min
                </Badge>
              </div>

              <Separator />

              <div className="prose max-w-none">
                <p>{activeChapter.description}</p>
              </div>

              {activeChapter.resources?.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Resources</h3>
                  <div className="space-y-2">
                    {activeChapter.resources.map((resource: any) => (
                      <Button
                        key={resource._id}
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={resource.content}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {resource.title}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={navigateToPrevChapter}
                  disabled={!prevChapter}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={navigateToNextChapter} disabled={!nextChapter}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
