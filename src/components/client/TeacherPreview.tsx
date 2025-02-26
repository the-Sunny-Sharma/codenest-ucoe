"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface TeacherPreviewProps {
  title: string;
  name: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  expertise: string[];
  bio: string;
}

export function TeacherPreview({
  title,
  name,
  qualifications,
  expertise,
  bio,
}: TeacherPreviewProps) {
  const session = useSession();
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={session?.data?.user.image || ""} alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {title} {name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {qualifications
              .map((q) => `${q.degree} (${q.institution}, ${q.year})`)
              .join(", ")}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">Areas of Expertise</h3>
        <ul className="list-disc list-inside mb-4">
          {expertise.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
        <h3 className="font-semibold mb-2">Bio</h3>
        <p className="text-sm">{bio}</p>
      </CardContent>
    </Card>
  );
}
