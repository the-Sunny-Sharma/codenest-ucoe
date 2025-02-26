// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Upload, X } from "lucide-react";
// import { toast } from "sonner";

// interface FileUploadProps {
//   onUploadComplete: (url: string) => void;
//   accept?: string;
//   maxSize?: number; // in bytes
//   type: "image" | "video";
// }

// export function FileUpload({
//   onUploadComplete,
//   accept,
//   maxSize = 10485760,
//   type,
// }: FileUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleUpload = async (file: File) => {
//     if (maxSize && file.size > maxSize) {
//       toast.error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
//       return;
//     }

//     setIsUploading(true);
//     setProgress(0);

//     try {
//       if (type === "image") {
//         const formData = new FormData();
//         formData.append("file", file);

//         const response = await fetch("/api/upload/image", {
//           method: "POST",
//           body: formData,
//         });

//         if (!response.ok) throw new Error("Upload failed");

//         const data = await response.json();
//         onUploadComplete(data.url);
//       } else {
//         // Get upload URL from Mux
//         const response = await fetch("/api/upload/video", {
//           method: "POST",
//         });

//         if (!response.ok) throw new Error("Failed to get upload URL");

//         const { uploadUrl, assetId } = await response.json();

//         // Upload file to Mux
//         const upload = await fetch(uploadUrl, {
//           method: "PUT",
//           body: file,
//           headers: {
//             "Content-Type": file.type,
//           },
//         });

//         if (!upload.ok) throw new Error("Upload failed");

//         // Poll for asset readiness
//         const checkAsset = async () => {
//           const assetResponse = await fetch(`/api/mux/asset/${assetId}`);
//           const assetData = await assetResponse.json();

//           if (assetData.status === "ready") {
//             onUploadComplete(assetData.playbackId);
//           } else if (assetData.status === "preparing") {
//             setProgress((prev) => Math.min(prev + 10, 90));
//             setTimeout(checkAsset, 1000);
//           } else {
//             throw new Error("Asset processing failed");
//           }
//         };

//         setTimeout(checkAsset, 1000);
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload file");
//     } finally {
//       setIsUploading(false);
//       setProgress(100);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <Button
//           variant="outline"
//           disabled={isUploading}
//           onClick={() => document.getElementById("file-upload")?.click()}
//         >
//           {isUploading ? (
//             <X className="mr-2 h-4 w-4" />
//           ) : (
//             <Upload className="mr-2 h-4 w-4" />
//           )}
//           {isUploading ? "Uploading..." : "Upload File"}
//         </Button>
//         <input
//           id="file-upload"
//           type="file"
//           className="hidden"
//           accept={accept}
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) handleUpload(file);
//           }}
//         />
//       </div>
//       {isUploading && <Progress value={progress} className="w-full" />}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  // type: "image" | "video";
}

export function FileUpload({
  onUploadComplete,
  accept,
  maxSize = 10485760,
}: // type,
FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    if (maxSize && file.size > maxSize) {
      toast.error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadWithProgress(formData);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setIsUploading(false);
    }
  };

  const uploadWithProgress = async (formData: FormData) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload/image", true);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.url);
          setProgress(100);
          setIsUploading(false);
          resolve();
        } else {
          toast.error("Upload failed");
          setIsUploading(false);
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        toast.error("Upload error");
        setIsUploading(false);
        reject(new Error("Upload error"));
      };

      xhr.send(formData);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {isUploading ? (
            <X className="mr-2 h-4 w-4" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>
      {isUploading && <Progress value={progress} className="w-full" />}
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Upload, X } from "lucide-react";
// import { toast } from "sonner";

// interface FileUploadProps {
//   onUploadComplete: (playbackId: string) => void;
//   accept?: string;
//   maxSize?: number; // in bytes
//   type: "image" | "video";
// }

// export function FileUpload({
//   onUploadComplete,
//   accept,
//   maxSize = 10485760,
//   type,
// }: FileUploadProps) {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleUpload = async (file: File) => {
//     if (maxSize && file.size > maxSize) {
//       toast.error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
//       return;
//     }

//     setIsUploading(true);
//     setProgress(0);

//     try {
//       // Step 1: Get direct upload URL from API
//       const response = await fetch("/api/upload/video", { method: "POST" });
//       if (!response.ok) throw new Error("Failed to get upload URL");

//       const { uploadUrl, assetId } = await response.json();
//       if (!uploadUrl) throw new Error("Invalid upload URL received");

//       // Step 2: Upload the file directly to Mux
//       await uploadWithProgress(uploadUrl, file);

//       // Step 3: Notify success and pass playbackId
//       onUploadComplete(assetId);
//       toast.success("Video uploaded successfully!");
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload file");
//       setIsUploading(false);
//     }
//   };

//   const uploadWithProgress = async (uploadUrl: string, file: File) => {
//     return new Promise<void>((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open("PUT", uploadUrl, true);
//       xhr.setRequestHeader("Content-Type", file.type);

//       // Track upload progress
//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           const percentComplete = Math.round(
//             (event.loaded / event.total) * 100
//           );
//           setProgress(percentComplete);
//         }
//       };

//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           setProgress(100);
//           setIsUploading(false);
//           resolve();
//         } else {
//           toast.error("Upload failed");
//           setIsUploading(false);
//           reject(new Error("Upload failed"));
//         }
//       };

//       xhr.onerror = () => {
//         toast.error("Upload error");
//         setIsUploading(false);
//         reject(new Error("Upload error"));
//       };

//       xhr.send(file);
//     });
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <Button
//           variant="outline"
//           disabled={isUploading}
//           onClick={() => document.getElementById("file-upload")?.click()}
//         >
//           {isUploading ? (
//             <X className="mr-2 h-4 w-4" />
//           ) : (
//             <Upload className="mr-2 h-4 w-4" />
//           )}
//           {isUploading ? "Uploading..." : "Upload File"}
//         </Button>
//         <input
//           id="file-upload"
//           type="file"
//           className="hidden"
//           accept={accept}
//           onChange={(e) => {
//             const file = e.target.files?.[0];
//             if (file) handleUpload(file);
//           }}
//         />
//       </div>
//       {isUploading && <Progress value={progress} className="w-full" />}
//     </div>
//   );
// }
