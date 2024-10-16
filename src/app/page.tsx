"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Moon,
  Sun,
  Link as LinkIcon,
  BookOpen,
  Users,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CurrentUser {
  name: string;
  profilePicture: string;
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (session?.user) {
      setCurrentUser({
        name: session.user.name ?? "",
        profilePicture:
          session.user.image ??
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
      });
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CodeNest</h1>
        <nav className="flex items-center space-x-4">
          {status === "unauthenticated" ? (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={currentUser.profilePicture}
                      alt={currentUser.name}
                    />
                    <AvatarFallback>
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center"
                  onSelect={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Welcome to CodeNest</h2>
          <p className="text-xl mb-8">
            Learn coding through interactive live sessions and on-demand courses
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Live Coding Sessions"
            description="Join interactive live coding sessions with expert instructors"
            icon={<LinkIcon className="h-12 w-12" />}
          />
          <FeatureCard
            title="On-Demand Courses"
            description="Access a wide range of courses at your own pace"
            icon={<BookOpen className="h-12 w-12" />}
          />
          <FeatureCard
            title="Collaborative Learning"
            description="Engage with peers and instructors in real-time"
            icon={<Users className="h-12 w-12" />}
          />
        </div>
      </main>
      <footer className="bg-muted py-4 text-center">
        <p>&copy; 2024 CodeNest. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
