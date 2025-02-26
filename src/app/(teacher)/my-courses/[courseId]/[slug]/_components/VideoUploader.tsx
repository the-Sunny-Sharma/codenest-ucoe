// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Upload } from "lucide-react";
// import { toast } from "sonner";

// interface VideoUploaderProps {
//   courseId: string;
// }

// export default function VideoUploader({ courseId }: VideoUploaderProps) {
//   const [uploading, setUploading] = useState(false);
//   const [videoTitle, setVideoTitle] = useState("");
//   const [videoFile, setVideoFile] = useState<File | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setVideoFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!videoFile || !videoTitle) {
//       toast.error("Please provide a title and select a video file");
//       return;
//     }

//     setUploading(true);

//     try {
//       // Get a signed URL from your backend
//       const signedUrlResponse = await fetch(
//         `/api/mux/upload-url?filename=${encodeURIComponent(videoFile.name)}`
//       );
//       const { uploadUrl, assetId } = await signedUrlResponse.json();

//       // Upload the file directly to Mux
//       await fetch(uploadUrl, {
//         method: "PUT",
//         body: videoFile,
//         headers: {
//           "Content-Type": videoFile.type,
//         },
//       });

//       // Notify your backend that the upload is complete
//       const response = await fetch(`/api/courses/${courseId}/videos`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title: videoTitle, assetId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to save video information");
//       }

//       toast.success("Video uploaded successfully");
//       setVideoTitle("");
//       setVideoFile(null);
//     } catch (error) {
//       console.error("Error uploading video:", error);
//       toast.error("Failed to upload video");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upload Video</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div>
//           <Label htmlFor="video-title">Video Title</Label>
//           <Input
//             id="video-title"
//             value={videoTitle}
//             onChange={(e) => setVideoTitle(e.target.value)}
//             placeholder="Enter video title"
//           />
//         </div>
//         <div>
//           <Label htmlFor="video-file">Video File</Label>
//           <Input
//             id="video-file"
//             type="file"
//             accept="video/*"
//             onChange={handleFileChange}
//           />
//         </div>
//         <Button onClick={handleUpload} disabled={uploading}>
//           {uploading ? (
//             "Uploading..."
//           ) : (
//             <>
//               <Upload className="mr-2 h-4 w-4" /> Upload Video
//             </>
//           )}
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface VideoUploaderProps {
  courseId: string;
}

export default function VideoUploader({ courseId }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !videoTitle) {
      toast.error("Please provide a title and select a video file");
      return;
    }

    setUploading(true);
    setProgress(0);
    setEstimatedTime(null);

    try {
      // Step 1: Get signed URL from backend
      const { data } = await axios.post("/api/mux/upload-url");
      const { uploadUrl, assetId } = data;

      // Step 2: Upload the video to Mux
      const startTime = Date.now();
      await axios.put(uploadUrl, videoFile, {
        headers: { "Content-Type": videoFile.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);

            // Estimate time remaining
            const timeElapsed = (Date.now() - startTime) / 1000; // in seconds
            const speed = progressEvent.loaded / timeElapsed; // bytes/sec
            const remainingBytes = progressEvent.total - progressEvent.loaded;
            const estimatedSeconds = Math.round(remainingBytes / speed);
            setEstimatedTime(estimatedSeconds);
          }
        },
      });

      console.log(`/api/courses/${courseId}/videos Giving a post request`);
      // Step 3: Save video details to the course
      await axios.post(`/api/courses/${courseId}/videos`, {
        title: videoTitle,
        assetId,
      });

      toast.success("Video uploaded successfully");
      setVideoTitle("");
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="video-title">Video Title</Label>
          <Input
            id="video-title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div>
          <Label htmlFor="video-file">Video File</Label>
          <Input
            id="video-file"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div>
            <Progress value={progress} className="w-full" />
            {estimatedTime !== null && (
              <p className="text-sm text-gray-500">
                Estimated time: {estimatedTime}s
              </p>
            )}
          </div>
        )}

        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? (
            `Uploading... ${progress}%`
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
