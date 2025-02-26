"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Copy } from "lucide-react";
import { toast } from "sonner";

interface LiveStreamSetupProps {
  courseId: string;
}

interface StreamDetails {
  streamKey: string;
  playbackId: string;
}

export default function LiveStreamSetup({ courseId }: LiveStreamSetupProps) {
  const [streamDetails, setStreamDetails] = useState<StreamDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreamDetails();
  }, []); // Updated dependency array

  const fetchStreamDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/live-stream`);
      if (!response.ok) {
        throw new Error("Failed to fetch stream details");
      }
      const data = await response.json();
      setStreamDetails(data);
    } catch (error) {
      console.error("Error fetching stream details:", error);
      toast.error("Failed to load stream details");
    } finally {
      setLoading(false);
    }
  };

  const createLiveStream = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/live-stream`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to create live stream");
      }
      const data = await response.json();
      setStreamDetails(data);
      toast.success("Live stream created successfully");
    } catch (error) {
      console.error("Error creating live stream:", error);
      toast.error("Failed to create live stream");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      () => {
        toast.error("Failed to copy");
      }
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stream Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {streamDetails ? (
          <>
            <div>
              <Label htmlFor="stream-key">Stream Key</Label>
              <div className="flex">
                <Input
                  id="stream-key"
                  value={streamDetails.streamKey}
                  readOnly
                  type="password"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(streamDetails.streamKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="playback-id">Playback ID</Label>
              <div className="flex">
                <Input
                  id="playback-id"
                  value={streamDetails.playbackId}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(streamDetails.playbackId)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button asChild>
              <a
                href={`https://stream.mux.com/${streamDetails.playbackId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Video className="mr-2 h-4 w-4" /> View Stream
              </a>
            </Button>
          </>
        ) : (
          <Button onClick={createLiveStream}>Create Live Stream</Button>
        )}
      </CardContent>
    </Card>
  );
}
