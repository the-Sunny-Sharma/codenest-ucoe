"use client";

import { useState, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  streamKey?: string;
  playbackId?: string;
  isLive?: boolean;
  muxStreamId?: string;
}

export default function VideoPlayer({
  courseId,
  chapterId,
  streamKey,
  playbackId,
  isLive,
  muxStreamId,
}: VideoPlayerProps) {
  const [videoPlaybackId, setVideoPlaybackId] = useState<string | null>(
    playbackId || null
  );
  const [streamType, setStreamType] = useState<"live" | "on-demand">(
    isLive ? "live" : "on-demand"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch recorded asset when needed
  const fetchRecordedAsset = async () => {
    if (isLive || !muxStreamId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/mux/get-recorded-asset?courseId=${courseId}&chapterId=${chapterId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recorded asset");
      }

      const data = await response.json();

      if (data.success && data.playbackId) {
        setVideoPlaybackId(data.playbackId);
        setStreamType("on-demand");
      } else {
        throw new Error("No playback ID found for recorded asset");
      }
    } catch (err) {
      console.error("Error fetching recorded asset:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Check for recorded asset on component mount if not live
  useEffect(() => {
    if (!isLive && !videoPlaybackId && muxStreamId) {
      fetchRecordedAsset();
    }
  }, [isLive, videoPlaybackId, muxStreamId]);

  // Update state when props change
  useEffect(() => {
    if (playbackId !== videoPlaybackId && playbackId) {
      setVideoPlaybackId(playbackId);
    }

    if (isLive !== (streamType === "live")) {
      setStreamType(isLive ? "live" : "on-demand");
    }
  }, [playbackId, isLive]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/5">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/5">
        <div className="text-center max-w-md p-4">
          <p className="text-sm text-destructive mb-2">
            Error loading video: {error}
          </p>
          <button
            onClick={fetchRecordedAsset}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!videoPlaybackId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black/5">
        <p className="text-sm text-muted-foreground">
          No video available. The stream may not have been recorded.
        </p>
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={videoPlaybackId}
      streamType={streamType}
      autoPlay={false}
      controls
      className="w-full h-full"
    />
  );
}
