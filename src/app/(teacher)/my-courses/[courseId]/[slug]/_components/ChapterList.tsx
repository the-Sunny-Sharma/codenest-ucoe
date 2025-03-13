// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Switch } from "@/components/ui/switch";
// import { Droppable, Draggable } from "@hello-pangea/dnd";
// import { GripVertical, Plus, Trash } from "lucide-react";
// import type { IChapter, IResource } from "@/app/types";
// // import { FileUpload } from "@/components/client/FileUpload";
// // import { VideoUpload } from "@/components/client/VideoUploadBtn";
// import { VideoUpload } from "./_cloudinary/UploadBtn";
// import Hls from "hls.js"; // Import HLS.js

// interface ChapterListProps {
//   sectionId: string;
//   chapters: IChapter[];
//   isEditing: boolean;
//   onUpdate: (updatedChapters: IChapter[]) => void;
// }

// export default function ChapterList({
//   sectionId,
//   chapters: initialChapters,
//   isEditing,
//   onUpdate,
// }: ChapterListProps) {
//   const [chapters, setChapters] = useState<IChapter[]>(initialChapters);

//   // useEffect(() => {
//   //   console.log("Chapters updated:", chapters); // Debugging

//   //   chapters.forEach((chapter, index) => {
//   //     if (chapter.videoUrl && Hls.isSupported()) {
//   //       const videoElement = document.getElementById(
//   //         `video-${index}`
//   //       ) as HTMLVideoElement;

//   //       if (videoElement) {
//   //         const hls = new Hls();

//   //         hls.loadSource(chapter.videoUrl);

//   //         hls.attachMedia(videoElement);
//   //       }
//   //     }
//   //   });
//   // }, [chapters]);
//   useEffect(() => {
//     console.log("Chapters updated:", chapters); // Debugging

//     chapters.forEach((chapter, index) => {
//       if (chapter.videoUrl) {
//         const videoElement = document.getElementById(
//           `video-${index}`
//         ) as HTMLVideoElement;

//         if (videoElement) {
//           if (chapter.videoUrl.endsWith(".m3u8") && Hls.isSupported()) {
//             const hls = new Hls();
//             hls.loadSource(chapter.videoUrl);
//             hls.attachMedia(videoElement);
//             videoElement.onloadedmetadata = () => videoElement.load();

//             return () => {
//               hls.destroy(); // Ensure we clean up Hls instances
//             };
//           } else {
//             videoElement.src = chapter.videoUrl;
//             videoElement.load();
//           }
//         }
//       }
//     });
//   }, [chapters]);

//   useEffect(() => {
//     chapters.forEach((chapter, index) => {
//       if (chapter.videoUrl) {
//         const videoElement = document.getElementById(
//           `video-${index}`
//         ) as HTMLVideoElement;

//         if (videoElement) {
//           videoElement.src = chapter.videoUrl;
//           videoElement.load();
//         }
//       }
//     });
//   }, [chapters]);

//   const handleAddChapter = () => {
//     const newChapter: IChapter = {
//       _id: Date.now().toString(),
//       title: "New Chapter",
//       description: "",
//       resources: [],
//       isLive: false,
//       duration: 0,
//       order: chapters.length + 1,
//       videoUrl: "",
//     };
//     const updatedChapters = [...chapters, newChapter];
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//   };

//   const handleUpdateChapter = (
//     index: number,
//     field: keyof IChapter,
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     value: any
//   ) => {
//     setChapters((prevChapters) => {
//       const updatedChapters = prevChapters.map((chapter, i) =>
//         i === index ? { ...chapter, [field]: value } : chapter
//       );

//       setChapters(updatedChapters);
//       onUpdate(updatedChapters);
//       console.log("Updated chapters:", updatedChapters); // Debug log
//       return updatedChapters;
//     });
//   };

//   // const handleUpdateChapter = (
//   //   index: number,
//   //   field: keyof IChapter,
//   //   value: any
//   // ) => {
//   //   const updatedChapters = [...chapters];
//   //   updatedChapters[index] = { ...updatedChapters[index], [field]: value };
//   //   setChapters(updatedChapters);
//   //   onUpdate(updatedChapters);
//   // };

//   const handleDeleteChapter = (index: number) => {
//     const updatedChapters = chapters.filter((_, i) => i !== index);
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//   };

//   const handleAddResource = (chapterIndex: number) => {
//     const updatedChapters = [...chapters];
//     updatedChapters[chapterIndex].resources.push({
//       type: "text",
//       content: "",
//       title: "New Resource",
//     });
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//   };

//   const handleUpdateResource = (
//     chapterIndex: number,
//     resourceIndex: number,
//     field: keyof IResource,
//     value: string
//   ) => {
//     const updatedChapters = [...chapters];
//     updatedChapters[chapterIndex].resources[resourceIndex] = {
//       ...updatedChapters[chapterIndex].resources[resourceIndex],
//       [field]: value,
//     };
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//   };

//   const handleDeleteResource = (
//     chapterIndex: number,
//     resourceIndex: number
//   ) => {
//     const updatedChapters = [...chapters];
//     updatedChapters[chapterIndex].resources.splice(resourceIndex, 1);
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//   };

//   // const handleVideoUpload = (index: number, url: string, duration: number) => {
//   //   console.log("Uploaded Video URL:", url);

//   //   setChapters((prevChapters) => {
//   //     const updatedChapters = [...prevChapters];
//   //     updatedChapters[index] = {
//   //       ...updatedChapters[index],
//   //       videoUrl: url,
//   //       duration,
//   //     };
//   //     return updatedChapters;
//   //   });

//   //   onUpdate([...chapters]); // Ensure the parent component gets the update
//   // };
//   // const handleVideoUpload = (index: number, url: string, duration: number) => {
//   //   console.log("Uploaded Video URL:", url);

//   //   setChapters((prevChapters) => {
//   //     const updatedChapters = [...prevChapters];
//   //     updatedChapters[index] = {
//   //       ...updatedChapters[index],
//   //       videoUrl: url,
//   //       duration,
//   //     };

//   //     // Ensure the parent gets the latest chapters
//   //     onUpdate(updatedChapters);
//   //     console.log("Updated chapters after video upload:", updatedChapters) // Debug log
//   //     return updatedChapters;
//   //   });
//   // };
//   const handleVideoUpload = (index: number, url: string, duration: number) => {
//     const updatedChapters = chapters.map((chapter, i) =>
//       i === index ? { ...chapter, videoUrl: url, duration } : chapter
//     );
//     setChapters(updatedChapters);
//     onUpdate(updatedChapters);
//     console.log("Updated chapters after video upload:", updatedChapters); // Debug log
//   };

//   return (
//     <div className="space-y-4">
//       <Droppable droppableId={`chapters-${sectionId}`}>
//         {(provided) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             <Accordion type="single" collapsible className="w-full">
//               {chapters.map((chapter, index) => (
//                 <Draggable
//                   key={
//                     typeof chapter._id === "string"
//                       ? chapter._id
//                       : chapter._id.toString()
//                   }
//                   draggableId={
//                     typeof chapter._id === "string"
//                       ? chapter._id
//                       : chapter._id.toString()
//                   }
//                   index={index}
//                 >
//                   {(provided) => (
//                     <div ref={provided.innerRef} {...provided.draggableProps}>
//                       <AccordionItem
//                         value={
//                           typeof chapter._id === "string"
//                             ? chapter._id
//                             : chapter._id.toString()
//                         }
//                         className="border rounded-lg mb-4"
//                       >
//                         <div className="flex items-center">
//                           <div
//                             {...provided.dragHandleProps}
//                             className="p-2 hover:bg-accent rounded-l-lg cursor-grab"
//                           >
//                             <GripVertical className="h-5 w-5 text-muted-foreground" />
//                           </div>
//                           <AccordionTrigger className="flex-1 hover:no-underline">
//                             <div className="flex items-center justify-between w-full">
//                               <span className="text-left font-medium">
//                                 {chapter.order}. {chapter.title}
//                               </span>
//                               {isEditing && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteChapter(index);
//                                   }}
//                                 >
//                                   <Trash className="h-4 w-4" />
//                                 </Button>
//                               )}
//                             </div>
//                           </AccordionTrigger>
//                         </div>
//                         <AccordionContent>
//                           <Card>
//                             <CardContent className="space-y-4">
//                               <div>
//                                 <Label htmlFor={`chapter-title-${index}`}>
//                                   Title
//                                 </Label>
//                                 <Input
//                                   id={`chapter-title-${index}`}
//                                   value={chapter.title}
//                                   onChange={(e) =>
//                                     handleUpdateChapter(
//                                       index,
//                                       "title",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                               </div>
//                               <div>
//                                 <Label htmlFor={`chapter-description-${index}`}>
//                                   Description
//                                 </Label>
//                                 <Textarea
//                                   id={`chapter-description-${index}`}
//                                   value={chapter.description}
//                                   onChange={(e) =>
//                                     handleUpdateChapter(
//                                       index,
//                                       "description",
//                                       e.target.value
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                               </div>
//                               <div>
//                                 <Label htmlFor={`chapter-duration-${index}`}>
//                                   Duration (minutes)
//                                 </Label>
//                                 <Input
//                                   id={`chapter-duration-${index}`}
//                                   type="number"
//                                   value={chapter.duration}
//                                   onChange={(e) =>
//                                     handleUpdateChapter(
//                                       index,
//                                       "duration",
//                                       Number.parseInt(e.target.value)
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Switch
//                                   id={`chapter-isLive-${index}`}
//                                   checked={chapter.isLive}
//                                   onCheckedChange={(checked) =>
//                                     handleUpdateChapter(
//                                       index,
//                                       "isLive",
//                                       checked
//                                     )
//                                   }
//                                   disabled={!isEditing}
//                                 />
//                                 <Label htmlFor={`chapter-isLive-${index}`}>
//                                   Live Session
//                                 </Label>
//                               </div>
//                               {chapter.isLive && (
//                                 <div>
//                                   <Label
//                                     htmlFor={`chapter-liveSessionDate-${index}`}
//                                   >
//                                     Live Session Date
//                                   </Label>
//                                   <Input
//                                     id={`chapter-liveSessionDate-${index}`}
//                                     type="datetime-local"
//                                     value={chapter.liveSessionDate
//                                       ?.toISOString()
//                                       .slice(0, 16)}
//                                     onChange={(e) =>
//                                       handleUpdateChapter(
//                                         index,
//                                         "liveSessionDate",
//                                         new Date(e.target.value)
//                                       )
//                                     }
//                                     disabled={!isEditing}
//                                   />
//                                 </div>
//                               )}

//                               {/* {!chapter.isLive && (
//                                 <div>
//                                   <Label htmlFor={`chapter-video-${index}`}>
//                                     Video
//                                   </Label>

//                                   <VideoUpload
//                                     onUploadComplete={(playbackId) => {
//                                       handleUpdateChapter(
//                                         index,
//                                         "muxPlaybackId",
//                                         playbackId
//                                       );

//                                       handleUpdateChapter(
//                                         index,
//                                         "videoUrl",
//                                         `https://stream.mux.com/${playbackId}.m3u8`
//                                       );
//                                     }}
//                                   />
//                                   {chapter.videoUrl && (
//                                     <div className="mt-2 aspect-video">

//                                       <video
//                                         id={`video-${index}`}
//                                         controls
//                                         className="w-full h-full rounded-lg"
//                                       />
//                                     </div>
//                                   )}
//                                 </div>
//                               )} */}

//                               {!chapter.isLive && (
//                                 <div>
//                                   <Label htmlFor={`chapter-video-${index}`}>
//                                     Video
//                                   </Label>
//                                   <VideoUpload
//                                     // onUploadComplete={(url, duration) => {
//                                     //   handleUpdateChapter(
//                                     //     index,
//                                     //     "videoUrl",
//                                     //     url
//                                     //   );
//                                     //   handleUpdateChapter(
//                                     //     index,
//                                     //     "duration",
//                                     //     duration
//                                     //   );
//                                     // }}
//                                     onUploadComplete={(url, duration) => {
//                                       console.log("Uploaded Video URL:", url);

//                                       handleVideoUpload(index, url, duration);

//                                       // Debugging: Log existing chapter URLs before updating
//                                       chapters.forEach((chapter) => {
//                                         console.log(
//                                           `Before Update - Chapter: ${chapter.title}, Video URL: ${chapter.videoUrl}`
//                                         );
//                                       });

//                                       // Updating the videoUrl field
//                                       handleUpdateChapter(
//                                         index,
//                                         "videoUrl",
//                                         url
//                                       );
//                                       handleUpdateChapter(
//                                         index,
//                                         "duration",
//                                         duration
//                                       );

//                                       setTimeout(() => {
//                                         const videoElement =
//                                           document.getElementById(
//                                             `video-${index}`
//                                           ) as HTMLVideoElement | null;
//                                         videoElement?.load();
//                                       }, 100);

//                                       // Debugging: Log updated chapters
//                                       setTimeout(() => {
//                                         chapters.forEach((chapter) => {
//                                           console.log(
//                                             `After Update - Chapter: ${chapter.title}, Video URL: ${chapter.videoUrl}`
//                                           );
//                                         });
//                                       }, 500);
//                                     }}
//                                   />
//                                   {/* {chapter.videoUrl && (
//                                     <div className="mt-2 aspect-video">
//                                       <video
//                                         src={chapter.videoUrl}
//                                         controls
//                                         className="w-full h-full rounded-lg"
//                                       />
//                                     </div>
//                                   )} */}
//                                   {chapter.videoUrl && (
//                                     <div className="mt-2 aspect-video">
//                                       {chapter.videoUrl && (
//                                         <div className="mt-2 aspect-video">
//                                           <video
//                                             id={`video-${index}`}
//                                             key={chapter.videoUrl} // Forces re-render
//                                             controls
//                                             className="w-full h-full rounded-lg"
//                                           >
//                                             <source
//                                               src={chapter.videoUrl}
//                                               type="video/mp4"
//                                             />
//                                           </video>
//                                         </div>
//                                       )}
//                                     </div>
//                                   )}
//                                 </div>
//                               )}

//                               {!chapter.isLive && (
//                                 <>
//                                   <div>
//                                     <Label
//                                       htmlFor={`chapter-scheduledTime-${index}`}
//                                     >
//                                       Scheduled Time
//                                     </Label>
//                                     <Input
//                                       id={`chapter-scheduledTime-${index}`}
//                                       type="datetime-local"
//                                       value={chapter.scheduledTime
//                                         ?.toISOString()
//                                         .slice(0, 16)}
//                                       onChange={(e) =>
//                                         handleUpdateChapter(
//                                           index,
//                                           "scheduledTime",
//                                           new Date(e.target.value)
//                                         )
//                                       }
//                                       disabled={!isEditing}
//                                     />
//                                   </div>
//                                   <div>
//                                     <Label
//                                       htmlFor={`chapter-videoUrl-${index}`}
//                                     >
//                                       Video URL
//                                     </Label>
//                                     <Input
//                                       id={`chapter-videoUrl-${index}`}
//                                       value={chapter.videoUrl}
//                                       onChange={(e) =>
//                                         handleUpdateChapter(
//                                           index,
//                                           "videoUrl",
//                                           e.target.value
//                                         )
//                                       }
//                                       disabled={!isEditing}
//                                     />
//                                   </div>
//                                 </>
//                               )}
//                               <div>
//                                 <Label>Resources</Label>
//                                 {chapter.resources.map(
//                                   (resource, resourceIndex) => (
//                                     <div
//                                       key={resourceIndex}
//                                       className="mt-2 space-y-2"
//                                     >
//                                       <Input
//                                         value={resource.title}
//                                         onChange={(e) =>
//                                           handleUpdateResource(
//                                             index,
//                                             resourceIndex,
//                                             "title",
//                                             e.target.value
//                                           )
//                                         }
//                                         placeholder="Resource Title"
//                                         disabled={!isEditing}
//                                       />
//                                       <select
//                                         value={resource.type}
//                                         onChange={(e) =>
//                                           handleUpdateResource(
//                                             index,
//                                             resourceIndex,
//                                             "type",
//                                             e.target.value as IResource["type"]
//                                           )
//                                         }
//                                         disabled={!isEditing}
//                                         className="w-full p-2 border rounded"
//                                       >
//                                         <option value="pdf">PDF</option>
//                                         <option value="text">Text</option>
//                                         <option value="link">Link</option>
//                                         <option value="code">Code</option>
//                                       </select>
//                                       <Textarea
//                                         value={resource.content}
//                                         onChange={(e) =>
//                                           handleUpdateResource(
//                                             index,
//                                             resourceIndex,
//                                             "content",
//                                             e.target.value
//                                           )
//                                         }
//                                         placeholder="Resource Content"
//                                         disabled={!isEditing}
//                                       />
//                                       {isEditing && (
//                                         <Button
//                                           variant="destructive"
//                                           size="sm"
//                                           onClick={() =>
//                                             handleDeleteResource(
//                                               index,
//                                               resourceIndex
//                                             )
//                                           }
//                                         >
//                                           Delete Resource
//                                         </Button>
//                                       )}
//                                     </div>
//                                   )
//                                 )}
//                                 {isEditing && (
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handleAddResource(index)}
//                                     className="mt-2"
//                                   >
//                                     Add Resource
//                                   </Button>
//                                 )}
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </AccordionContent>
//                       </AccordionItem>
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//             </Accordion>
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//       {isEditing && (
//         <Button onClick={handleAddChapter}>
//           <Plus className="mr-2 h-4 w-4" /> Add Chapter
//         </Button>
//       )}
//     </div>
//   );
// }

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash, Video, Radio } from "lucide-react";
import type { IChapter, IResource } from "@/types";
import { VideoUpload } from "./_cloudinary/UploadBtn";
import Hls from "hls.js"; // Import HLS.js
import { Badge } from "@/components/ui/badge";

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
      lectureType: "prerecordedVideo", // Default to prerecorded
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

      // Special handling for lectureType changes
      if (field === "lectureType") {
        // If changing to prerecordedVideo, ensure isLive is false
        if (value === "prerecordedVideo") {
          updatedChapters[index].isLive = false;
        }
        // If changing to liveLecture, ensure isLive is set (default to true)
        else if (value === "liveLecture") {
          updatedChapters[index].isLive = true;
        }
      }

      onUpdate(updatedChapters);
      console.log("Updated chapters:", updatedChapters); // Debug log
      return updatedChapters;
    });
  };

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

  const handleVideoUpload = (index: number, url: string, duration: number) => {
    const updatedChapters = chapters.map((chapter, i) =>
      i === index ? { ...chapter, videoUrl: url, duration } : chapter
    );
    setChapters(updatedChapters);
    onUpdate(updatedChapters);
    console.log("Updated chapters after video upload:", updatedChapters); // Debug log
  };

  return (
    <div className="space-y-4">
      <Droppable droppableId={`chapters-${sectionId}`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Accordion type="single" collapsible className="w-full">
              {chapters.map((chapter, index) => (
                <Draggable
                  key={
                    typeof chapter._id === "string"
                      ? chapter._id
                      : chapter._id.toString()
                  }
                  draggableId={
                    typeof chapter._id === "string"
                      ? chapter._id
                      : chapter._id.toString()
                  }
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <AccordionItem
                        value={
                          typeof chapter._id === "string"
                            ? chapter._id
                            : chapter._id.toString()
                        }
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
                              <div className="flex items-center gap-2">
                                <span className="text-left font-medium">
                                  {chapter.order}. {chapter.title}
                                </span>
                                {chapter.lectureType === "liveLecture" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  >
                                    <Radio className="h-3 w-3 mr-1" />
                                    Live
                                  </Badge>
                                )}
                                {chapter.lectureType === "prerecordedVideo" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                  >
                                    <Video className="h-3 w-3 mr-1" />
                                    Video
                                  </Badge>
                                )}
                              </div>
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

                              {/* Lecture Type Selection */}
                              <div>
                                <Label htmlFor={`chapter-lectureType-${index}`}>
                                  Lecture Type
                                </Label>
                                <Select
                                  value={chapter.lectureType}
                                  onValueChange={(value) =>
                                    handleUpdateChapter(
                                      index,
                                      "lectureType",
                                      value
                                    )
                                  }
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger
                                    id={`chapter-lectureType-${index}`}
                                  >
                                    <SelectValue placeholder="Select lecture type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="prerecordedVideo">
                                      <div className="flex items-center">
                                        <Video className="h-4 w-4 mr-2" />
                                        Pre-recorded Video
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="liveLecture">
                                      <div className="flex items-center">
                                        <Radio className="h-4 w-4 mr-2" />
                                        Live Lecture
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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

                              {/* Live Lecture Settings */}
                              {chapter.lectureType === "liveLecture" && (
                                <>
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
                                      Is Currently Live
                                    </Label>
                                  </div>

                                  <div>
                                    <Label
                                      htmlFor={`chapter-scheduledTime-${index}`}
                                    >
                                      Scheduled Time
                                    </Label>
                                    <Input
                                      id={`chapter-scheduledTime-${index}`}
                                      type="datetime-local"
                                      value={
                                        chapter.scheduledTime
                                          ? new Date(chapter.scheduledTime)
                                              .toISOString()
                                              .slice(0, 16)
                                          : ""
                                      }
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
                                </>
                              )}

                              {/* Pre-recorded Video Settings */}
                              {chapter.lectureType === "prerecordedVideo" && (
                                <>
                                  <div>
                                    <Label htmlFor={`chapter-video-${index}`}>
                                      Video
                                    </Label>
                                    <VideoUpload
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
                                      }}
                                    />

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

                                  <div>
                                    <Label
                                      htmlFor={`chapter-scheduledTime-${index}`}
                                    >
                                      Available From (Optional)
                                    </Label>
                                    <Input
                                      id={`chapter-scheduledTime-${index}`}
                                      type="datetime-local"
                                      value={
                                        chapter.scheduledTime
                                          ? new Date(chapter.scheduledTime)
                                              .toISOString()
                                              .slice(0, 16)
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleUpdateChapter(
                                          index,
                                          "scheduledTime",
                                          e.target.value
                                            ? new Date(e.target.value)
                                            : null
                                        )
                                      }
                                      disabled={!isEditing}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      If set, the video will only be available
                                      after this date
                                    </p>
                                  </div>

                                  <div>
                                    <Label
                                      htmlFor={`chapter-videoUrl-${index}`}
                                    >
                                      Video URL (Manual Entry)
                                    </Label>
                                    <Input
                                      id={`chapter-videoUrl-${index}`}
                                      value={chapter.videoUrl || ""}
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

                              {/* Resources Section */}
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
