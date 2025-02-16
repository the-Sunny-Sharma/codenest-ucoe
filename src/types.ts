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
