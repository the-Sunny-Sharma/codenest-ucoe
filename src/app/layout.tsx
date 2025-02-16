import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { auth } from "@/auth";
import { getUserRole } from "@/lib/auth";
import type React from "react";

export const metadata: Metadata = {
  title: "CodeNest",
  description: "Designed and Developed by Love, Peace and Happiness",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userRole = "student";

  if (session?.user?.email) {
    userRole = await getUserRole(session.user.email);
  }

  return (
    <html lang="en">
      <body>
        <Providers session={session} userRole={userRole}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
