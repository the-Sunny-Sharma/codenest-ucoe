export interface User {
  name: string;
  email: string;
  picture: string;
  sub: string;
  iat: number;
  exp: number;
  jti: string;
}

// File: types/index.ts
export interface CourseFormData {
  name: string;
  description: string;
  thumbnail: FileList;
  promoVideo: FileList;
  price: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  prerequisites: string[];
  language: string;
  certificate: boolean;
  category: string;
}

export interface IResource {
  _id: string;
  name: string;
  url: string;
}

export interface IChapter {
  _id: string;
  title: string;
  description: string;
  resources: IResource[];
  lectureType: "liveLecture" | "prerecordedVideo"; // New field
  isLive?: boolean; // Only applicable when lectureType is liveLecture
  scheduledTime?: Date; // Determines when the lecture becomes available
  videoUrl?: string;
  duration: number;
  order: number;
  muxPlaybackId?: string;
  muxAssetId?: string;
}
