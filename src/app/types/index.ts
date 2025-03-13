// import type { ObjectId } from "mongoose";

// export interface IResource {
//   _id?: string;
//   type: "pdf" | "text" | "link" | "code";
//   content: string;
//   title: string;
// }

// export interface IChapter {
//   _id: string;
//   title: string;
//   description: string;
//   resources: IResource[];
//   isLive: boolean;
//   liveSessionDate?: Date;
//   scheduledTime?: Date;
//   videoUrl?: string;
//   duration: number;
//   order: number;
//   muxPlaybackId?: string;
//   muxAssetId?: string;
// }

// export interface ISection {
//   _id: string;
//   title: string;
//   description: string;
//   order: number;
//   whatYoullLearn: string[];
//   prerequisites: string[];
//   totalChapters: number;
//   totalDuration: number;
//   coverPhoto: string;
//   chapters: IChapter[];
// }

// export interface ICourse {
//   _id: string;
//   name: string;
//   slug: string;
//   description: string;
//   thumbnail: string;
//   promoVideo: string;
//   instructor: ObjectId | string;
//   price: number;
//   enrolledStudents: (ObjectId | string)[];
//   classCode: string;
//   totalHours: number;
//   level: "Beginner" | "Intermediate" | "Advanced";
//   tags: string[];
//   prerequisites: string[];
//   sections: ISection[];
//   createdAt: Date;
//   updatedAt: Date;
//   publishedAt?: Date;
//   rating: number;
//   numberOfReviews: number;
//   language: string;
//   certificate: boolean;
//   status: "draft" | "published" | "archived";
//   category: string;
//   liveStream?: {
//     streamKey: string;
//     playbackId: string;
//   };
// }

// export interface CourseManagementProps {
//   initialCourse: ICourse;
// }

// export interface SectionListProps {
//   courseId: string;
//   sections: ISection[];
//   isEditing: boolean;
// }

// export interface ChapterListProps {
//   sectionId: string;
//   chapters: IChapter[];
//   isEditing: boolean;
//   onUpdate: (updatedChapters: IChapter[]) => void;
// }

// export interface VideoUploaderProps {
//   courseId: string;
// }

// export interface LiveStreamSetupProps {
//   courseId: string;
// }
import type { ObjectId } from "mongoose";

/** Resource Type */
export interface IResource {
  _id?: ObjectId | string; // ✅ Fixed: Allow ObjectId or string
  type: "pdf" | "text" | "link" | "code";
  content: string;
  title: string;
}

/** Chapter Type */
export interface IChapter {
  _id: ObjectId | string; // ✅ Fixed: Allow ObjectId or string
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

/** Section Type */
export interface ISection {
  _id: ObjectId | string; // ✅ Fixed: Allow ObjectId or string
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

/** Course Type */
export interface ICourse {
  _id: ObjectId | string; // ✅ Fixed: Allow ObjectId or string
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  promoVideo: string;
  instructor: ObjectId | string; // ✅ Fixed: Allow ObjectId or string
  price: number;
  enrolledStudents: (ObjectId | string)[]; // ✅ Fixed: Allow ObjectId or string array
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

/** Props for Course Management */
export interface CourseManagementProps {
  initialCourse: ICourse;
}

/** Props for Sections */
export interface SectionListProps {
  courseId: string;
  sections: ISection[];
  isEditing: boolean;
}

/** Props for Chapters */
export interface ChapterListProps {
  sectionId: string;
  chapters: IChapter[];
  isEditing: boolean;
  onUpdate: (updatedChapters: IChapter[]) => void;
}

/** Props for Video Uploader */
export interface VideoUploaderProps {
  courseId: string;
}

/** Props for Live Streaming Setup */
export interface LiveStreamSetupProps {
  courseId: string;
}
