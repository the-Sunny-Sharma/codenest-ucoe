"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, AlertTriangle, Calendar, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import MuxPlayer to avoid SSR issues
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-muted flex items-center justify-center">
      <div className="animate-pulse">Loading player...</div>
    </div>
  ),
});

interface LiveStreamPlayerProps {
  courseId: string;
  chapterId: string;
  title: string;
  scheduledTime?: Date;
}

export function LiveStreamPlayer({
  courseId,
  chapterId,
  title,
  scheduledTime,
}: LiveStreamPlayerProps) {
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerKey, setPlayerKey] = useState<number>(0); // Used to force player re-render
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // Use a ref to track if we need to force a player refresh
  const lastPlaybackId = useRef<string | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const manualRefreshCount = useRef<number>(0);

  const logRef = useRef<string[]>([]);

  const addDebugLog = useCallback((message: string) => {
    console.log(`LiveStreamPlayer Debug: ${message}`);
    const newLog = `${new Date().toISOString().substring(11, 19)} - ${message}`;
    logRef.current = [...logRef.current, newLog].slice(-20);
    setDebugLogs(logRef.current);
  }, []);

  const fetchStreamDetails = useCallback(async () => {
    try {
      addDebugLog("Fetching stream details...");
      setLoading(true);
      const response = await fetch(
        `/api/mux/live-stream?courseId=${courseId}&chapterId=${chapterId}`
      );

      if (response.ok) {
        const data = await response.json();
        addDebugLog(
          `Stream details received: playbackId=${data.playbackId}, isLive=${data.isLive}`
        );
        setPlaybackId(data.playbackId);
        setStreamKey(data.streamKey);
        setIsLive(data.isLive);

        // Try to extract stream ID from stream key (usually the first part)
        if (data.streamKey) {
          const possibleStreamId = data.streamKey.split("/")[0];
          setStreamId(possibleStreamId);
          addDebugLog(`Extracted possible stream ID: ${possibleStreamId}`);
        }

        lastPlaybackId.current = data.playbackId;
        setError(null);
      } else if (response.status !== 404) {
        const errorData = await response.json();
        addDebugLog(
          `Error fetching stream details: ${
            errorData.error || response.statusText
          }`
        );
        console.error("Failed to fetch stream details:", errorData);
        setError(errorData.error || "Failed to fetch stream details");
      }
    } catch (error) {
      addDebugLog(`Exception fetching stream details: ${error.message}`);
      console.error("Error fetching stream details:", error);
      setError("Error fetching stream details");
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, addDebugLog]);

  const checkStreamStatus = useCallback(async () => {
    if (!streamKey) {
      addDebugLog("Skipping status check - no stream key available");
      return; // Don't check if no stream exists yet
    }

    try {
      addDebugLog("Checking stream status...");
      const response = await fetch(
        `/api/mux/live-stream/status?courseId=${courseId}&chapterId=${chapterId}`
      );

      if (response.ok) {
        const data = await response.json();
        addDebugLog(
          `Stream status update: isLive=${data.isLive}, playbackId=${data.playbackId}`
        );

        // Update live status
        const wasLive = isLive;
        setIsLive(data.isLive);

        // Update playback ID if it changed
        if (data.playbackId && data.playbackId !== playbackId) {
          addDebugLog(
            `Playback ID changed: ${playbackId} -> ${data.playbackId}`
          );
          setPlaybackId(data.playbackId);

          // Force player refresh if playback ID changed
          if (lastPlaybackId.current !== data.playbackId) {
            addDebugLog("Forcing player refresh due to playback ID change");
            setPlayerKey((prev) => prev + 1);
            lastPlaybackId.current = data.playbackId;
          }
        }

        // If stream just went live, force player refresh
        if (!wasLive && data.isLive) {
          addDebugLog("Stream just went live, forcing player refresh");
          setPlayerKey((prev) => prev + 1);

          // Show notification
          toast.success("Stream is now live!");
        }
      } else {
        const errorData = await response.json();
        addDebugLog(
          `Error checking stream status: ${
            errorData.error || response.statusText
          }`
        );
      }
    } catch (error) {
      addDebugLog(`Exception checking stream status: ${error.message}`);
      console.error("Error checking stream status:", error);
    }
  }, [courseId, chapterId, streamKey, isLive, playbackId, addDebugLog]);

  useEffect(() => {
    addDebugLog(
      `Component mounted - courseId: ${courseId}, chapterId: ${chapterId}`
    );
    fetchStreamDetails();

    // Set up the status check interval
    statusCheckInterval.current = setInterval(() => {
      checkStreamStatus();
    }, 5000); // Check every 5 seconds

    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
        addDebugLog("Cleared status check interval");
      }
    };
  }, [courseId, chapterId, addDebugLog, fetchStreamDetails, checkStreamStatus]);

  const createLiveStream = useCallback(async () => {
    try {
      addDebugLog("Creating live stream...");
      setLoading(true);
      const response = await fetch("/api/mux/live-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, chapterId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addDebugLog(
          `Error creating live stream: ${
            errorData.error || response.statusText
          }`
        );
        throw new Error(errorData.error || "Failed to create live stream");
      }

      const data = await response.json();
      addDebugLog(
        `Created stream: playbackId=${data.playbackId}, streamKey=${data.streamKey}`
      );
      setPlaybackId(data.playbackId);
      setStreamKey(data.streamKey);

      // Try to extract stream ID from stream key (usually the first part)
      if (data.streamKey) {
        const possibleStreamId = data.streamKey.split("/")[0];
        setStreamId(possibleStreamId);
        addDebugLog(`Extracted possible stream ID: ${possibleStreamId}`);
      }

      lastPlaybackId.current = data.playbackId;
      toast.success("Live stream created successfully");
    } catch (error) {
      addDebugLog(`Exception creating live stream: ${error.message}`);
      console.error("Error creating live stream:", error);
      toast.error(error.message || "Failed to create live stream");
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, addDebugLog]);

  const createPlaybackId = useCallback(async () => {
    if (!streamId) {
      addDebugLog("Cannot create playback ID - no stream ID available");
      toast.error("Cannot create playback ID - no stream ID available");
      return;
    }

    try {
      addDebugLog(`Manually creating playback ID for stream: ${streamId}`);
      setLoading(true);
      const response = await fetch("/api/mux/create-playback-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, chapterId, streamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        addDebugLog(
          `Error creating playback ID: ${
            errorData.error || response.statusText
          }`
        );
        throw new Error(errorData.error || "Failed to create playback ID");
      }

      const data = await response.json();
      addDebugLog(`Created new playback ID: ${data.playbackId}`);
      setPlaybackId(data.playbackId);
      lastPlaybackId.current = data.playbackId;
      setPlayerKey((prev) => prev + 1);
      toast.success("New playback ID created successfully");
    } catch (error) {
      addDebugLog(`Exception creating playback ID: ${error.message}`);
      console.error("Error creating playback ID:", error);
      toast.error(error.message || "Failed to create playback ID");
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId, streamId, addDebugLog]);

  const forceRefreshPlayer = useCallback(() => {
    manualRefreshCount.current += 1;
    addDebugLog(
      `Manually refreshing player (count: ${manualRefreshCount.current})`
    );
    setPlayerKey((prev) => prev + 1);
    toast.success("Player refreshed");
  }, [addDebugLog]);

  const copyStreamKey = useCallback(() => {
    if (streamKey) {
      navigator.clipboard.writeText(streamKey);
      addDebugLog("Stream key copied to clipboard");
      toast.success("Stream key copied to clipboard");
    }
  }, [streamKey, addDebugLog]);

  useEffect(() => {
    addDebugLog(
      `Rendering player: playbackId=${playbackId}, isLive=${isLive}, playerKey=${playerKey}`
    );
  }, [addDebugLog, playbackId, isLive, playerKey]);

  if (loading && !playbackId && !streamKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="text-center text-red-500">{error}</p>
          <Button onClick={fetchStreamDetails}>Retry</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide Debug Logs" : "Show Debug Logs"}
          </Button>
          {showDebug && (
            <div className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-40">
              {debugLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!playbackId && !streamKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No live stream configured yet
          </p>
          <Button onClick={createLiveStream} disabled={loading}>
            {loading ? "Creating..." : "Create Live Stream"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide Debug Logs" : "Show Debug Logs"}
          </Button>
          {showDebug && (
            <div className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-40">
              {debugLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (scheduledTime && new Date(scheduledTime) > new Date()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <Calendar className="h-12 w-12 text-orange-500" />
          <p className="text-center">
            This live stream is scheduled for{" "}
            {new Date(scheduledTime).toLocaleString()}
          </p>
          {streamKey && (
            <div className="w-full space-y-2">
              <p className="text-sm font-medium">Stream Key:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full font-mono"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                >
                  {showStreamKey ? streamKey : "••••••••••••••••"}
                </Button>
                <Button variant="outline" onClick={copyStreamKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use this stream key in OBS Studio or your preferred streaming
                software
              </p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide Debug Logs" : "Show Debug Logs"}
          </Button>
          {showDebug && (
            <div className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-40">
              {debugLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Always show the player for the teacher if we have a playback ID,
  // even if not live yet, so they can see it as soon as it goes live
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isLive ? (
            <>
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              {title} - Live
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              {title} - Waiting for stream
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {streamKey && (
            <div className="w-full space-y-2">
              <p className="text-sm font-medium">Stream Key:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full font-mono"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                >
                  {showStreamKey ? streamKey : "••••••••••••••••"}
                </Button>
                <Button variant="outline" onClick={copyStreamKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use this stream key in OBS Studio or your preferred streaming
                software
              </p>
            </div>
          )}

          <div className="aspect-video">
            {playbackId && (
              <>
                <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
                  <span>
                    Debug: Using playback ID: {playbackId} (Stream{" "}
                    {isLive ? "is" : "is not"} live)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={forceRefreshPlayer}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" /> Refresh Player
                    </Button>
                    {streamId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={createPlaybackId}
                      >
                        Create New Playback ID
                      </Button>
                    )}
                  </div>
                </div>
                <MuxPlayer
                  key={playerKey} // Force re-render when key changes
                  playbackId={playbackId}
                  metadata={{
                    video_title: title,
                    player_name: "CodeNest Live Stream Player",
                  }}
                  streamType="live"
                  autoPlay
                  muted
                  debug
                  // Show loading state until stream is live
                  placeholder={!isLive ? "Stream is not live yet" : undefined}
                />
              </>
            )}
          </div>

          {!isLive && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Stream is currently offline. Start streaming to go live.</p>
              <p className="mt-1">
                The player will automatically update when you go live.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide Debug Logs" : "Show Debug Logs"}
          </Button>
          {showDebug && (
            <div className="w-full mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-40">
              {debugLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
