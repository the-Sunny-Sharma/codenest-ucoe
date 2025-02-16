"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Code,
  Database,
  Layers,
  LinkIcon,
  LogOut,
  Moon,
  Server,
  Sun,
  User,
  Users,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";

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

  const techStack = [
    {
      name: "Next.js",
      description: "React framework for production",
      icon: <Code className="h-8 w-8" />,
    },
    {
      name: "TypeScript",
      description: "Typed superset of JavaScript",
      icon: <Code className="h-8 w-8" />,
    },
    {
      name: "MongoDB",
      description: "NoSQL database",
      icon: <Database className="h-8 w-8" />,
    },
    {
      name: "Node.js",
      description: "JavaScript runtime",
      icon: <Server className="h-8 w-8" />,
    },
  ];

  const libraries = [
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    { name: "Shadcn/ui", description: "Customizable UI components" },
    { name: "NextAuth.js", description: "Authentication for Next.js" },
    { name: "Axios", description: "Promise-based HTTP client" },
    { name: "React Hook Form", description: "Performant form validation" },
    { name: "Zod", description: "TypeScript-first schema validation" },
  ];

  if (session) console.log(session);

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
                      {currentUser.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : "U"}
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
      <main className="container mx-auto px-10 py-16">
        <section className="text-center mb-16">
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
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Project Flow</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                1
              </div>
              <p>User signs up or logs in</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                2
              </div>
              <p>Browse available courses or live sessions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                3
              </div>
              <p>Enroll in a course or join a live session</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                4
              </div>
              <p>Participate in interactive coding exercises</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                5
              </div>
              <p>Collaborate with peers and instructors</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                6
              </div>
              <p>Complete assignments and projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                7
              </div>
              <p>Receive feedback and improve skills</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((tech, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {tech.name}
                  </CardTitle>
                  {tech.icon}
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Libraries and Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {libraries.map((lib, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{lib.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {lib.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">
            Join CodeNest today and take your coding skills to the next level!
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </section>
      </main>
      <footer className="bg-muted py-4 text-center mt-16">
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
