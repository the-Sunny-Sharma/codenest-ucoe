"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Ban } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  onUploadComplete: (playbackId: string) => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setProgress(0);

    try {
      console.log("📡 Requesting Mux upload URL...");
      const res = await axios.post("/api/mux/upload-url");
      console.log("✅ Mux Upload URL Response:", res.data);

      const { uploadUrl, uploadId } = res.data;
      if (!uploadUrl || !uploadId) {
        throw new Error("❌ Missing uploadUrl or uploadId in response");
      }

      console.log("🚀 Uploading video to Mux...");
      await uploadWithProgress(uploadUrl, file);

      console.log("⏳ Polling Mux for Asset ID...");
      const assetId = await getAssetId(uploadId);
      if (!assetId) {
        throw new Error("❌ Failed to retrieve asset ID");
      }

      console.log("⏳ Polling Mux for Playback ID...");
      const playbackId = await getPlaybackId(assetId);
      if (!playbackId) {
        throw new Error("❌ Failed to retrieve playback ID");
      }

      console.log(
        "🎉 Video successfully uploaded with Playback ID:",
        playbackId
      );
      onUploadComplete(playbackId);
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Failed to upload video");
      setIsUploading(false);
    }
  };

  const uploadWithProgress = async (uploadUrl: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open("PUT", uploadUrl, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          console.log(`📊 Upload Progress: ${percentComplete}%`);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log("✅ Video uploaded successfully!");
          toast.success("Video uploaded successfully!");
          setProgress(100);
          setIsUploading(false);
          resolve();
        } else {
          console.error("❌ Upload failed:", xhr.status, xhr.statusText);
          toast.error("Upload failed");
          setIsUploading(false);
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        console.error("❌ Upload error");
        toast.error("Upload error");
        setIsUploading(false);
        reject(new Error("Upload error"));
      };

      xhr.send(file);
    });
  };

  const getAssetId = async (uploadId: string): Promise<string | null> => {
    for (let i = 0; i < 10; i++) {
      console.log(
        `🔄 Attempt ${i + 1}: Requesting Asset ID for upload:`,
        uploadId
      );

      try {
        const res = await axios.post("/api/mux/asset-id", { uploadId });
        console.log("✅ Asset ID API Response:", res.data);

        const { assetId } = res.data;
        if (assetId) {
          console.log("🎥 Asset ID retrieved:", assetId);
          return assetId;
        }
      } catch (error) {
        console.error("⚠️ Error fetching asset ID:", error);
      }

      console.log("⏳ Mux is processing... Retrying in 5s.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    return null;
  };

  const getPlaybackId = async (assetId: string): Promise<string | null> => {
    for (let i = 0; i < 10; i++) {
      console.log(
        `🔄 Attempt ${i + 1}: Requesting Playback ID for asset:`,
        assetId
      );

      try {
        const res = await axios.post("/api/mux/playback-id", { assetId });
        console.log("✅ Playback API Response:", res.data);

        const { playbackId } = res.data;
        if (playbackId) {
          console.log("🎬 Playback ID retrieved:", playbackId);
          return playbackId;
        }
      } catch (error) {
        console.error("⚠️ Error fetching playback ID:", error);
      }

      console.log("⏳ Mux is processing... Retrying in 5s.");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    return null;
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      console.warn("⚠️ Upload canceled by user.");
      xhrRef.current.abort();
      setIsUploading(false);
      setProgress(0);
      toast.warning("Upload canceled");
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
          {isUploading ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Video"}
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
      {isUploading && <Progress value={progress} className="w-full" />}
    </div>
  );
}
