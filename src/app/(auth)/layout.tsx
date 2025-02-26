import { AuthHeader } from "@/components/client/auth/AuthHeader";
import type { Metadata } from "next";
import type { ReactNode } from "react";
// import { usePathname } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: getPageTitle(),
    description: "Access your CodeNest account securely.",
  };
}

function getPageTitle(): string {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.includes("/login")) return "Login - CodeNest";
    if (path.includes("/signup")) return "Sign Up - CodeNest";
    if (path.includes("/forgot-password")) return "Forgot Password - CodeNest";
  }
  return "Authenticate - CodeNest";
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}
