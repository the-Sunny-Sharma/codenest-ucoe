"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash } from "lucide-react";
import type { IChapter, IResource } from "@/app/types";
// import { FileUpload } from "@/components/client/FileUpload";
// import { VideoUpload } from "@/components/client/VideoUploadBtn";
import { VideoUpload } from "./_cloudinary/UploadBtn";
import Hls from "hls.js"; // Import HLS.js

interface ChapterListProps {
  sectionId: string;
  chapters: IChapter[];
  isEditing: boolean;
  onUpdate: (updatedChapters: IChapter[]) => void;
}

export default function ChapterList({
  sectionId,
  chapters: initialChapters,
  isEditing,
  onUpdate,
}: ChapterListProps) {
  const [chapters, setChapters] = useState<IChapter[]>(initialChapters);

  // useEffect(() => {
  //   console.log("Chapters updated:", chapters); // Debugging

  //   chapters.forEach((chapter, index) => {
  //     if (chapter.videoUrl && Hls.isSupported()) {
  //       const videoElement = document.getElementById(
  //         `video-${index}`
  //       ) as HTMLVideoElement;

  //       if (videoElement) {
  //         const hls = new Hls();

  //         hls.loadSource(chapter.videoUrl);

  //         hls.attachMedia(videoElement);
  //       }
  //     }
  //   });
  // }, [chapters]);
  useEffect(() => {
    console.log("Chapters updated:", chapters); // Debugging

    chapters.forEach((chapter, index) => {
      if (chapter.videoUrl) {
        const videoElement = document.getElementById(
          `video-${index}`
        ) as HTMLVideoElement;

        if (videoElement) {
          if (chapter.videoUrl.endsWith(".m3u8") && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(chapter.videoUrl);
            hls.attachMedia(videoElement);
            videoElement.onloadedmetadata = () => videoElement.load();

            return () => {
              hls.destroy(); // Ensure we clean up Hls instances
            };
          } else {
            videoElement.src = chapter.videoUrl;
            videoElement.load();
          }
        }
      }
    });
  }, [chapters]);

  useEffect(() => {
    chapters.forEach((chapter, index) => {
      if (chapter.videoUrl) {
        const videoElement = document.getElementById(
          `video-${index}`
        ) as HTMLVideoElement;

        if (videoElement) {
          videoElement.src = chapter.videoUrl;
          videoElement.load();
        }
      }
    });
  }, [chapters]);

  const handleAddChapter = () => {
    const newChapter: IChapter = {
      _id: Date.now().toString(),
      title: "New Chapter",
      description: "",
      resources: [],
      isLive: false,
      duration: 0,
      order: chapters.length + 1,
      videoUrl: "",
    };
    const updatedChapters = [...chapters, newChapter];
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
  };

  const handleUpdateChapter = (
    index: number,
    field: keyof IChapter,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setChapters((prevChapters) => {
      const updatedChapters = prevChapters.map((chapter, i) =>
        i === index ? { ...chapter, [field]: value } : chapter
      );

      console.log("Updated Chapters:", updatedChapters); // Debugging
      onUpdate(updatedChapters);
      return updatedChapters;
    });
  };

  // const handleUpdateChapter = (
  //   index: number,
  //   field: keyof IChapter,
  //   value: any
  // ) => {
  //   const updatedChapters = [...chapters];
  //   updatedChapters[index] = { ...updatedChapters[index], [field]: value };
  //   setChapters(updatedChapters);
  //   onUpdate(updatedChapters);
  // };

  const handleDeleteChapter = (index: number) => {
    const updatedChapters = chapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
  };

  const handleAddResource = (chapterIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].resources.push({
      type: "text",
      content: "",
      title: "New Resource",
    });
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
  };

  const handleUpdateResource = (
    chapterIndex: number,
    resourceIndex: number,
    field: keyof IResource,
    value: string
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].resources[resourceIndex] = {
      ...updatedChapters[chapterIndex].resources[resourceIndex],
      [field]: value,
    };
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
  };

  const handleDeleteResource = (
    chapterIndex: number,
    resourceIndex: number
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].resources.splice(resourceIndex, 1);
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
  };

  // const handleVideoUpload = (index: number, url: string, duration: number) => {
  //   console.log("Uploaded Video URL:", url);

  //   setChapters((prevChapters) => {
  //     const updatedChapters = [...prevChapters];
  //     updatedChapters[index] = {
  //       ...updatedChapters[index],
  //       videoUrl: url,
  //       duration,
  //     };
  //     return updatedChapters;
  //   });

  //   onUpdate([...chapters]); // Ensure the parent component gets the update
  // };
  const handleVideoUpload = (index: number, url: string, duration: number) => {
    console.log("Uploaded Video URL:", url);

    setChapters((prevChapters) => {
      const updatedChapters = [...prevChapters];
      updatedChapters[index] = {
        ...updatedChapters[index],
        videoUrl: url,
        duration,
      };

      // Ensure the parent gets the latest chapters
      onUpdate(updatedChapters);

      return updatedChapters;
    });
  };

  return (
    <div className="space-y-4">
      <Droppable droppableId={`chapters-${sectionId}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Accordion type="single" collapsible className="w-full">
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter._id}
                  draggableId={chapter._id}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <AccordionItem
                        value={chapter._id}
                        className="border rounded-lg mb-4"
                      >
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="p-2 hover:bg-accent rounded-l-lg cursor-grab"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <AccordionTrigger className="flex-1 hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-left font-medium">
                                {chapter.order}. {chapter.title}
                              </span>
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChapter(index);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          <Card>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor={`chapter-title-${index}`}>
                                  Title
                                </Label>
                                <Input
                                  id={`chapter-title-${index}`}
                                  value={chapter.title}
                                  onChange={(e) =>
                                    handleUpdateChapter(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`chapter-description-${index}`}>
                                  Description
                                </Label>
                                <Textarea
                                  id={`chapter-description-${index}`}
                                  value={chapter.description}
                                  onChange={(e) =>
                                    handleUpdateChapter(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`chapter-duration-${index}`}>
                                  Duration (minutes)
                                </Label>
                                <Input
                                  id={`chapter-duration-${index}`}
                                  type="number"
                                  value={chapter.duration}
                                  onChange={(e) =>
                                    handleUpdateChapter(
                                      index,
                                      "duration",
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`chapter-isLive-${index}`}
                                  checked={chapter.isLive}
                                  onCheckedChange={(checked) =>
                                    handleUpdateChapter(
                                      index,
                                      "isLive",
                                      checked
                                    )
                                  }
                                  disabled={!isEditing}
                                />
                                <Label htmlFor={`chapter-isLive-${index}`}>
                                  Live Session
                                </Label>
                              </div>
                              {chapter.isLive && (
                                <div>
                                  <Label
                                    htmlFor={`chapter-liveSessionDate-${index}`}
                                  >
                                    Live Session Date
                                  </Label>
                                  <Input
                                    id={`chapter-liveSessionDate-${index}`}
                                    type="datetime-local"
                                    value={chapter.liveSessionDate
                                      ?.toISOString()
                                      .slice(0, 16)}
                                    onChange={(e) =>
                                      handleUpdateChapter(
                                        index,
                                        "liveSessionDate",
                                        new Date(e.target.value)
                                      )
                                    }
                                    disabled={!isEditing}
                                  />
                                </div>
                              )}

                              {/* {!chapter.isLive && (
                                <div>
                                  <Label htmlFor={`chapter-video-${index}`}>
                                    Video
                                  </Label>
    
                                  <VideoUpload
                                    onUploadComplete={(playbackId) => {
                                      handleUpdateChapter(
                                        index,
                                        "muxPlaybackId",
                                        playbackId
                                      );

                                      handleUpdateChapter(
                                        index,
                                        "videoUrl",
                                        `https://stream.mux.com/${playbackId}.m3u8`
                                      );
                                    }}
                                  />
                                  {chapter.videoUrl && (
                                    <div className="mt-2 aspect-video">
                                      
                                      <video
                                        id={`video-${index}`}
                                        controls
                                        className="w-full h-full rounded-lg"
                                      />
                                    </div>
                                  )}
                                </div>
                              )} */}

                              {!chapter.isLive && (
                                <div>
                                  <Label htmlFor={`chapter-video-${index}`}>
                                    Video
                                  </Label>
                                  <VideoUpload
                                    // onUploadComplete={(url, duration) => {
                                    //   handleUpdateChapter(
                                    //     index,
                                    //     "videoUrl",
                                    //     url
                                    //   );
                                    //   handleUpdateChapter(
                                    //     index,
                                    //     "duration",
                                    //     duration
                                    //   );
                                    // }}
                                    onUploadComplete={(url, duration) => {
                                      console.log("Uploaded Video URL:", url);

                                      handleVideoUpload(index, url, duration);

                                      // Debugging: Log existing chapter URLs before updating
                                      chapters.forEach((chapter) => {
                                        console.log(
                                          `Before Update - Chapter: ${chapter.title}, Video URL: ${chapter.videoUrl}`
                                        );
                                      });

                                      // Updating the videoUrl field
                                      handleUpdateChapter(
                                        index,
                                        "videoUrl",
                                        url
                                      );
                                      handleUpdateChapter(
                                        index,
                                        "duration",
                                        duration
                                      );

                                      setTimeout(() => {
                                        const videoElement =
                                          document.getElementById(
                                            `video-${index}`
                                          ) as HTMLVideoElement | null;
                                        videoElement?.load();
                                      }, 100);

                                      // Debugging: Log updated chapters
                                      setTimeout(() => {
                                        chapters.forEach((chapter) => {
                                          console.log(
                                            `After Update - Chapter: ${chapter.title}, Video URL: ${chapter.videoUrl}`
                                          );
                                        });
                                      }, 500);
                                    }}
                                  />
                                  {/* {chapter.videoUrl && (
                                    <div className="mt-2 aspect-video">
                                      <video
                                        src={chapter.videoUrl}
                                        controls
                                        className="w-full h-full rounded-lg"
                                      />
                                    </div>
                                  )} */}
                                  {chapter.videoUrl && (
                                    <div className="mt-2 aspect-video">
                                      {chapter.videoUrl && (
                                        <div className="mt-2 aspect-video">
                                          <video
                                            id={`video-${index}`}
                                            key={chapter.videoUrl} // Forces re-render
                                            controls
                                            className="w-full h-full rounded-lg"
                                          >
                                            <source
                                              src={chapter.videoUrl}
                                              type="video/mp4"
                                            />
                                          </video>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {!chapter.isLive && (
                                <>
                                  <div>
                                    <Label
                                      htmlFor={`chapter-scheduledTime-${index}`}
                                    >
                                      Scheduled Time
                                    </Label>
                                    <Input
                                      id={`chapter-scheduledTime-${index}`}
                                      type="datetime-local"
                                      value={chapter.scheduledTime
                                        ?.toISOString()
                                        .slice(0, 16)}
                                      onChange={(e) =>
                                        handleUpdateChapter(
                                          index,
                                          "scheduledTime",
                                          new Date(e.target.value)
                                        )
                                      }
                                      disabled={!isEditing}
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`chapter-videoUrl-${index}`}
                                    >
                                      Video URL
                                    </Label>
                                    <Input
                                      id={`chapter-videoUrl-${index}`}
                                      value={chapter.videoUrl}
                                      onChange={(e) =>
                                        handleUpdateChapter(
                                          index,
                                          "videoUrl",
                                          e.target.value
                                        )
                                      }
                                      disabled={!isEditing}
                                    />
                                  </div>
                                </>
                              )}
                              <div>
                                <Label>Resources</Label>
                                {chapter.resources.map(
                                  (resource, resourceIndex) => (
                                    <div
                                      key={resourceIndex}
                                      className="mt-2 space-y-2"
                                    >
                                      <Input
                                        value={resource.title}
                                        onChange={(e) =>
                                          handleUpdateResource(
                                            index,
                                            resourceIndex,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Resource Title"
                                        disabled={!isEditing}
                                      />
                                      <select
                                        value={resource.type}
                                        onChange={(e) =>
                                          handleUpdateResource(
                                            index,
                                            resourceIndex,
                                            "type",
                                            e.target.value as IResource["type"]
                                          )
                                        }
                                        disabled={!isEditing}
                                        className="w-full p-2 border rounded"
                                      >
                                        <option value="pdf">PDF</option>
                                        <option value="text">Text</option>
                                        <option value="link">Link</option>
                                        <option value="code">Code</option>
                                      </select>
                                      <Textarea
                                        value={resource.content}
                                        onChange={(e) =>
                                          handleUpdateResource(
                                            index,
                                            resourceIndex,
                                            "content",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Resource Content"
                                        disabled={!isEditing}
                                      />
                                      {isEditing && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteResource(
                                              index,
                                              resourceIndex
                                            )
                                          }
                                        >
                                          Delete Resource
                                        </Button>
                                      )}
                                    </div>
                                  )
                                )}
                                {isEditing && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddResource(index)}
                                    className="mt-2"
                                  >
                                    Add Resource
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  )}
                </Draggable>
              ))}
            </Accordion>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isEditing && (
        <Button onClick={handleAddChapter}>
          <Plus className="mr-2 h-4 w-4" /> Add Chapter
        </Button>
      )}
    </div>
  );
}
