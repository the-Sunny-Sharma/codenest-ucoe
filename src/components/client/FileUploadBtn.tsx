import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (url: string) => void;
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button asChild variant="outline" disabled={isUploading}>
      <label className="cursor-pointer">
        <input type="file" className="hidden" onChange={handleUpload} />
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload File"}
      </label>
    </Button>
  );
}
