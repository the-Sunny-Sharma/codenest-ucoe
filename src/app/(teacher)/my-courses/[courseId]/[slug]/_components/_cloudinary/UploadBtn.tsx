"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Ban } from "lucide-react";
import { toast } from "sonner";
import { calculateEstimatedTime } from "@/lib/utils/calculateUploadTime";

interface VideoUploadProps {
  onUploadComplete: (url: string, duration: number) => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const abortController = useRef<AbortController | null>(null);
  const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB chunks

  const uploadChunk = async (
    chunk: Blob,
    chunkNumber: number,
    totalChunks: number,
    fileId: string
  ) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkNumber", chunkNumber.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("fileId", fileId);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload chunk ${chunkNumber}`);
    }

    return response.json();
  };

  const handleUpload = async (file: File) => {
    const MAX_FILE_SIZE = 104857600; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size should be 100MB or less");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    abortController.current = new AbortController();

    try {
      // Calculate estimated upload time
      const estimatedTimeStr = calculateEstimatedTime(file.size);
      setEstimatedTime(estimatedTimeStr);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "codenest_chapter_videos");
      formData.append("folder", "codenest/chapter_videos");

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        true
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);

          // Update estimated time based on progress
          if (percentComplete < 100) {
            const remainingSize = file.size * (1 - percentComplete / 100);
            const newEstimate = calculateEstimatedTime(remainingSize);
            setEstimatedTime(newEstimate);
          }
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        setProgress(100);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          toast.success("Video uploaded successfully!");
          onUploadComplete(data.secure_url, Math.round(data.duration || 0));
        } else {
          toast.error("Failed to upload video");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        toast.error("Error uploading video!");
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video");
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsUploading(false);
      setProgress(0);
      setEstimatedTime("");
      toast.info("Upload canceled.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById("video-upload")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? `Uploading... ${progress}%` : "Upload Video"}
        </Button>
        <input
          id="video-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
        {isUploading && (
          <Button variant="destructive" onClick={cancelUpload}>
            <Ban className="mr-2 h-4 w-4" /> Cancel Upload
          </Button>
        )}
      </div>
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Estimated time remaining: {estimatedTime}
          </p>
        </div>
      )}
    </div>
  );
}
