import type { ObjectId } from "mongoose";

export interface IResource {
  _id?: string;
  type: "pdf" | "text" | "link" | "code";
  content: string;
  title: string;
}

export interface IChapter {
  _id: string;
  title: string;
  description: string;
  resources: IResource[];
  isLive: boolean;
  liveSessionDate?: Date;
  scheduledTime?: Date;
  videoUrl?: string;
  duration: number;
  order: number;
  muxPlaybackId?: string;
  muxAssetId?: string;
}

export interface ISection {
  _id: string;
  title: string;
  description: string;
  order: number;
  whatYoullLearn: string[];
  prerequisites: string[];
  totalChapters: number;
  totalDuration: number;
  coverPhoto: string;
  chapters: IChapter[];
}

export interface ICourse {
  _id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  promoVideo: string;
  instructor: ObjectId;
  price: number;
  enrolledStudents: ObjectId[];
  classCode: string;
  totalHours: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  prerequisites: string[];
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  rating: number;
  numberOfReviews: number;
  language: string;
  certificate: boolean;
  status: "draft" | "published" | "archived";
  category: string;
  liveStream?: {
    streamKey: string;
    playbackId: string;
  };
}

export interface CourseManagementProps {
  initialCourse: ICourse;
}

export interface SectionListProps {
  courseId: string;
  sections: ISection[];
  isEditing: boolean;
}

export interface ChapterListProps {
  sectionId: string;
  chapters: IChapter[];
  isEditing: boolean;
  onUpdate: (updatedChapters: IChapter[]) => void;
}

export interface VideoUploaderProps {
  courseId: string;
}

export interface LiveStreamSetupProps {
  courseId: string;
}
