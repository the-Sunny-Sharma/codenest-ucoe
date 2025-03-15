"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  ChevronRight,
  LogOut,
  Settings,
  User,
  Radio,
  Video,
  Calendar,
  CheckCircle2,
  Maximize2,
  Minimize2,
  LayoutGrid,
  LayoutPanelTop,
  LayoutPanelLeft,
  LayoutPanelLeftIcon as LayoutPanelRight,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ICourse } from "@/models/Course";
import MuxPlayer from "@mux/mux-player-react";
import VideoPlayer from "./video-player";

interface ChapterViewProps {
  course: ICourse;
  courseId: string;
  slug: string;
  sectionOrder: string;
  chapterId: string;
}

// Layout presets
const LAYOUT_PRESETS = {
  VERTICAL: "vertical", // Video on top, code editor below
  HORIZONTAL: "horizontal", // Video on left, code editor on right
  CODE_FOCUS: "code-focus", // Small video, large code editor
  VIDEO_FOCUS: "video-focus", // Large video, small code editor
};

export default function ChapterView({
  course,
  courseId,
  slug,
  sectionOrder,
  chapterId,
}: ChapterViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedTheme, setSelectedTheme] = useState("all-hallows-eve");
  const [code, setCode] = useState("//Code here");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [layoutPreset, setLayoutPreset] = useState(LAYOUT_PRESETS.HORIZONTAL);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const [vodPlaybackId, setVodPlaybackId] = useState<string | null>(null);

  // Find current section and chapter
  const currentSection = course.sections.find(
    (s: any) => s.order === Number.parseInt(sectionOrder)
  );
  const currentChapter = currentSection?.chapters.find(
    (c: any) => c._id === chapterId
  );

  const isLiveSession =
    currentChapter?.lectureType === "liveLecture" && currentChapter?.isLive;

  const getRecordedPlaybackId = async (streamKey) => {
    try {
      const username = process.env.NEXT_PUBLIC_MUX_ACCESS_TOKEN; // Fetch from environment variables
      const password = process.env.NEXT_PUBLIC_MUX_SECRET_KEY;

      if (!username || !password) {
        console.error("Mux credentials are missing!");
        return null;
      }

      // Correct Base64 encoding
      const authHeader =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

      // Step 1: Fetch the Live Stream Data
      const res = await fetch(
        `https://api.mux.com/video/v1/live-streams/${streamKey}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      const data = await res.json();
      console.log("Live Stream Data:", data);

      // Handle Unauthorized Response
      if (res.status === 401) {
        console.error("Unauthorized: Check your Mux credentials.");
        return null;
      }

      // Step 2: Extract Asset ID (VOD Video)
      const assetId = data?.data?.recent_asset_ids?.[0];
      if (!assetId) {
        console.error("No recorded asset found.");
        return null;
      }

      // Step 3: Fetch the Asset Details
      const assetRes = await fetch(
        `https://api.mux.com/video/v1/assets/${assetId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      const assetData = await assetRes.json();
      console.log("Asset Data:", assetData);
      console.log(JSON.stringify(assetData, null, 2)); // Pretty-print with 2 spaces indentation

      // Step 4: Get the Playback ID
      const playbackId = assetData?.data?.playback_ids?.[0]?.id;
      console.log("PLAYBACK ID: ", playbackId);
      return playbackId;
    } catch (error) {
      console.error("Error fetching recorded playback ID:", error);
      return null;
    }
  };

  //   const getRecordedPlaybackId = async (streamKey) => {
  //     try {
  //       // Step 1: Fetch the Live Stream Data
  //       const res = await fetch(
  //         `https://api.mux.com/video/v1/live-streams/${streamKey}`,
  //         {
  //           headers: {
  //             Authorization: `Basic ${btoa("MUX_ACCESS_TOKEN:MUX_SECRET_KEY")}`,
  //           },
  //         }
  //       );

  //       const data = await res.json();
  //       console.log("Live Stream Data:", data);

  //       // Step 2: Extract Asset ID (VOD Video)
  //       const assetId = data?.data?.recent_asset_ids?.[0];
  //       if (!assetId) {
  //         console.error("No recorded asset found.");
  //         return null;
  //       }

  //       // Step 3: Fetch the Asset Details
  //       const assetRes = await fetch(
  //         `https://api.mux.com/video/v1/assets/${assetId}`,
  //         {
  //           headers: {
  //             Authorization: `Basic ${btoa("MUX_ACCESS_TOKEN:MUX_SECRET_KEY")}`,
  //           },
  //         }
  //       );

  //       const assetData = await assetRes.json();
  //       console.log("Asset Data:", assetData);

  //       // Step 4: Get the Playback ID
  //       const playbackId = assetData?.data?.playback_ids?.[0]?.id;
  //       return playbackId;
  //     } catch (error) {
  //       console.error("Error fetching recorded playback ID:", error);
  //       return null;
  //     }
  //   };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/progress`);
        const data = await response.json();
        setUserProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    if (!currentChapter?.isLive && currentChapter?.streamKey) {
      getRecordedPlaybackId(currentChapter.muxStreamId).then((vodId) => {
        if (vodId) {
          console.log("VODID", vodId);
          setVodPlaybackId(vodId);
        }
      });
    }
  }, [currentChapter?.isLive, currentChapter?.streamKey]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage,
          code,
          input: customInput,
        }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput("Error executing code");
      console.error("Error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleChapterComplete = async () => {
    try {
      //   const response = await fetch(`/api/courses/${courseId}/progress`, {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       chapterId,
      //       completed: true,
      //     }),
      //   });

      //   if (!response.ok) throw new Error("Failed to update progress");

      //   const data = await response.json();
      //   setUserProgress(data);

      toast({
        title: "Progress Updated",
        description: "Chapter marked as completed",
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const toggleVideoFullscreen = () => {
    if (!videoRef.current) return;

    if (!isVideoFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    setIsVideoFullscreen(!isVideoFullscreen);
  };

  // Calculate progress value
  const progressValue = userProgress?.progress || 0;

  // Determine layout configuration based on selected preset
  const getLayoutConfig = () => {
    switch (layoutPreset) {
      case LAYOUT_PRESETS.VERTICAL:
        return {
          direction: "vertical" as const,
          videoSize: 40,
          codeSize: 60,
        };
      case LAYOUT_PRESETS.HORIZONTAL:
        return {
          direction: "horizontal" as const,
          videoSize: 50,
          codeSize: 50,
        };
      case LAYOUT_PRESETS.CODE_FOCUS:
        return {
          direction: "horizontal" as const,
          videoSize: 30,
          codeSize: 70,
        };
      case LAYOUT_PRESETS.VIDEO_FOCUS:
        return {
          direction: "horizontal" as const,
          videoSize: 70,
          codeSize: 30,
        };
      default:
        return {
          direction: "horizontal" as const,
          videoSize: 50,
          codeSize: 50,
        };
    }
  };

  const layoutConfig = getLayoutConfig();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <CourseSidebar
                course={course}
                currentChapterId={chapterId}
                userProgress={userProgress}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-xl">CodeNest</h1>
            <span className="text-muted-foreground">|</span>
            <h2 className="text-sm font-medium truncate max-w-[200px] lg:max-w-[300px]">
              {course.name}
            </h2>
            <span>by</span>
            <h4>{course.instructor.title}</h4>
            <h3>{course.instructor.user.name}</h3>
            {isLiveSession && (
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Progress value={progressValue} className="w-28" />
              <span className="text-sm text-muted-foreground">
                {Math.round(progressValue)}%
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-72 border-r">
          <CourseSidebar
            course={course}
            currentChapterId={chapterId}
            userProgress={userProgress}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Layout Controls */}
          <div className="border-b p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Layout:</span>
              <Button
                variant={
                  layoutPreset === LAYOUT_PRESETS.VERTICAL
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setLayoutPreset(LAYOUT_PRESETS.VERTICAL)}
                className="h-8 w-8 p-0"
                title="Vertical Layout"
              >
                <LayoutPanelTop className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  layoutPreset === LAYOUT_PRESETS.HORIZONTAL
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setLayoutPreset(LAYOUT_PRESETS.HORIZONTAL)}
                className="h-8 w-8 p-0"
                title="Horizontal Layout"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  layoutPreset === LAYOUT_PRESETS.VIDEO_FOCUS
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setLayoutPreset(LAYOUT_PRESETS.VIDEO_FOCUS)}
                className="h-8 w-8 p-0"
                title="Video Focus"
              >
                <LayoutPanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={
                  layoutPreset === LAYOUT_PRESETS.CODE_FOCUS
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setLayoutPreset(LAYOUT_PRESETS.CODE_FOCUS)}
                className="h-8 w-8 p-0"
                title="Code Focus"
              >
                <LayoutPanelRight className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Button
                onClick={handleChapterComplete}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Complete
              </Button>
            </div>
          </div>

          {/* Resizable Content */}
          <ResizablePanelGroup
            direction={layoutConfig.direction}
            className="flex-1"
          >
            {/* Video Panel */}
            <ResizablePanel defaultSize={layoutConfig.videoSize} minSize={20}>
              <div className="h-full flex flex-col">
                <div className="relative flex-1" ref={videoRef}>
                  {currentChapter ? (
                    <>
                      {/* Debugging currentChapter */}
                      {console.log("currentChapter:", currentChapter)}

                      {currentChapter.lectureType === "liveLecture" ? (
                        (() => {
                          const scheduledTimeMs =
                            currentChapter.scheduledTime * 1000; // Convert if needed
                          const now = Date.now();

                          console.log("Scheduled Time (ms):", scheduledTimeMs);
                          console.log("Current Time (ms):", now);
                          console.log(
                            "Lecture Available:",
                            scheduledTimeMs <= now
                          );

                          return now <= now ? (
                            <div className="h-full flex flex-col">
                              <div className="relative flex-1">
                                {currentChapter.isLive ? (
                                  <VideoPlayer
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    streamKey={currentChapter.streamKey}
                                    playbackId={currentChapter.playbackId}
                                    isLive={currentChapter.isLive}
                                    muxStreamId={currentChapter.muxStreamId}
                                  />
                                ) : (
                                  <VideoPlayer
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    streamKey={currentChapter.streamKey}
                                    playbackId={vodPlaybackId}
                                    isLive={currentChapter.isLive}
                                    muxStreamId={currentChapter.muxStreamId}
                                  />
                                )}

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                                  onClick={toggleVideoFullscreen}
                                >
                                  {isVideoFullscreen ? (
                                    <Minimize2 className="h-4 w-4" />
                                  ) : (
                                    <Maximize2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>

                              {/* Live Session Tabs */}
                              <Tabs defaultValue="chat" className="w-full">
                                <TabsList className="w-full">
                                  <TabsTrigger value="chat" className="flex-1">
                                    Chat
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="resources"
                                    className="flex-1"
                                  >
                                    Resources
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="questions"
                                    className="flex-1"
                                  >
                                    Questions
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                  value="chat"
                                  className="p-4 h-40 overflow-y-auto"
                                >
                                  <p className="text-muted-foreground text-center">
                                    Live chat will appear here
                                  </p>
                                </TabsContent>
                                <TabsContent
                                  value="resources"
                                  className="p-4 h-40 overflow-y-auto"
                                >
                                  <p className="text-muted-foreground text-center">
                                    Course resources will appear here
                                  </p>
                                </TabsContent>
                                <TabsContent
                                  value="questions"
                                  className="p-4 h-40 overflow-y-auto"
                                >
                                  <p className="text-muted-foreground text-center">
                                    Ask questions about the lecture
                                  </p>
                                </TabsContent>
                              </Tabs>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-center">
                              <div>
                                <Calendar className="h-12 w-12 mx-auto mb-4" />
                                <p>This lecture is scheduled for:</p>
                                <p className="font-semibold">
                                  {new Date(
                                    currentChapter.scheduledTime
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="relative h-full">
                          <video
                            src={currentChapter?.videoUrl}
                            controls
                            className="w-full h-full"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                            onClick={toggleVideoFullscreen}
                          >
                            {isVideoFullscreen ? (
                              <Minimize2 className="h-4 w-4" />
                            ) : (
                              <Maximize2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>Loading chapter data...</p>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle>
              <GripVertical className="h-4 w-4" />
            </ResizableHandle>

            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={layoutConfig.codeSize} minSize={20}>
              <div className="flex-1 flex flex-col h-full">
                {/* Editor Header */}
                <div className="border-b p-2 flex items-center gap-2">
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">
                        JavaScript (Node.js)
                      </SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedTheme}
                    onValueChange={setSelectedTheme}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-hallows-eve">
                        All Hallows Eve
                      </SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="ml-auto"
                  >
                    Compile and Execute
                  </Button>
                </div>

                {/* Editor and Output */}
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                  {/* Code Editor */}
                  <ResizablePanel defaultSize={50} minSize={20}>
                    <div className="h-full">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full resize-none bg-black text-white font-mono p-4 focus:outline-none"
                        spellCheck={false}
                      />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle>
                    <GripVertical className="h-4 w-4" />
                  </ResizableHandle>

                  {/* Output Panel */}
                  <ResizablePanel defaultSize={50} minSize={20}>
                    <ResizablePanelGroup
                      direction="vertical"
                      className="h-full"
                    >
                      <ResizablePanel defaultSize={70} minSize={20}>
                        <div className="p-4 h-full overflow-auto">
                          <h3 className="font-medium mb-2">Output</h3>
                          <div className="font-mono whitespace-pre-wrap">
                            {output || (
                              <div className="text-center text-muted-foreground py-8">
                                No output details available
                                <br />
                                Run your code to see the output
                              </div>
                            )}
                          </div>
                        </div>
                      </ResizablePanel>

                      <ResizableHandle withHandle>
                        <GripVertical className="h-4 w-4 rotate-90" />
                      </ResizableHandle>

                      <ResizablePanel defaultSize={30} minSize={20}>
                        <div className="p-4 h-full">
                          <h3 className="font-medium mb-2">Custom Input</h3>
                          <Textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Enter input here..."
                            className="font-mono h-[calc(100%-2rem)]"
                          />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}

function CourseSidebar({
  course,
  currentChapterId,
  userProgress,
}: {
  course: any;
  currentChapterId: string;
  userProgress: any;
}) {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isChapterCompleted = (chapterId: string) => {
    return userProgress?.completedChapters?.includes(chapterId);
  };

  return (
    <div className="h-full bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Course Content</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {course.sections.map((section: any) => (
          <div key={section._id}>
            <button
              onClick={() => toggleSection(section._id)}
              className="flex items-center justify-between w-full p-4 hover:bg-muted text-left"
            >
              <span className="font-medium">
                Section {section.order}: {section.title}
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  openSections.includes(section._id) && "rotate-90"
                )}
              />
            </button>
            {openSections.includes(section._id) && (
              <div className="pl-4">
                {section.chapters.map((chapter: any) => {
                  const isActive = chapter._id === currentChapterId;
                  const isCompleted = isChapterCompleted(chapter._id);
                  const isLive = chapter.isLive;
                  const isScheduled =
                    chapter.lectureType === "liveLecture" &&
                    chapter.scheduledTime &&
                    new Date(chapter.scheduledTime) > new Date();

                  return (
                    <button
                      key={chapter._id}
                      onClick={() =>
                        router.push(
                          `/courses/${course._id}/${course.slug}/section/${section.order}/chapter/${chapter._id}`
                        )
                      }
                      className={cn(
                        "flex items-center gap-2 w-full p-3 text-sm hover:bg-muted text-left",
                        isActive && "bg-muted"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : isLive ? (
                        <Radio className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : isScheduled ? (
                        <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      ) : (
                        <Video className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{chapter.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
