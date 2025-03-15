"use client";

import { useState, useEffect } from "react";

interface UseRecordedAssetProps {
  courseId: string;
  chapterId: string;
  muxStreamId?: string;
  initialPlaybackId?: string;
}

interface RecordedAssetState {
  playbackId: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecordedAsset({
  courseId,
  chapterId,
  muxStreamId,
  initialPlaybackId,
}: UseRecordedAssetProps): RecordedAssetState {
  const [playbackId, setPlaybackId] = useState<string | null>(
    initialPlaybackId || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecordedAsset = async () => {
    if (!muxStreamId) {
      setError("No stream ID provided");
      return;
    }

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
        setPlaybackId(data.playbackId);
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

  useEffect(() => {
    if (!playbackId && muxStreamId) {
      fetchRecordedAsset();
    }
  }, [muxStreamId]);

  return {
    playbackId,
    isLoading,
    error,
    refetch: fetchRecordedAsset,
  };
}
