import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Browse Courses | CodeNest",
  description:
    "Discover and enroll in programming courses across web development, mobile development, data science, and more.",
  keywords:
    "programming courses, online learning, web development, mobile development, data science, coding bootcamp",
  openGraph: {
    title: "Browse Courses | CodeNest",
    description:
      "Discover and enroll in programming courses across web development, mobile development, data science, and more.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
