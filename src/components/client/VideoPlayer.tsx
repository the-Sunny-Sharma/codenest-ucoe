"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

interface VideoPlayerProps {
  url: string;
  thumbnail?: string; // Optional thumbnail prop
}

export function VideoPlayer({
  url,
  thumbnail = "/placeholder.svg",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isPlaying) {
    return (
      <div
        className="relative w-full h-full cursor-pointer group"
        onClick={() => setIsPlaying(true)}
      >
        {/* Display the thumbnail image */}
        <Image
          src={thumbnail}
          alt="Video Thumbnail"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/50 p-4 backdrop-blur-sm group-hover:bg-black/70 transition-colors">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <video
      src={url}
      controls
      className="w-full h-full rounded-lg"
      autoPlay
      poster={thumbnail}
    >
      Your browser does not support the video tag.
    </video>
  );
}
