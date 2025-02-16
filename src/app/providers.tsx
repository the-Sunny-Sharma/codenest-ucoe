"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { createContext, useContext } from "react";
import type React from "react";

type UserRole = "student" | "teacher" | "admin";

interface UserContextType {
  role: UserRole;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserRole() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserProvider");
  }
  return context.role;
}

export function Providers({
  children,
  session,
  userRole,
}: {
  children: React.ReactNode;
  session: any;
  userRole: UserRole;
}) {
  return (
    <SessionProvider session={session}>
      <UserContext.Provider value={{ role: userRole }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </UserContext.Provider>
    </SessionProvider>
  );
}
