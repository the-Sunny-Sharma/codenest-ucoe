"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Search,
  User,
  GamepadIcon,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const projectTasks = [
  { name: "Project Planning", status: "completed" },
  { name: "System Architecture Design", status: "completed" },
  { name: "Database Design", status: "completed" },
  { name: "User Authentication", status: "completed" },
  { name: "Course Management System", status: "in-progress" },
  { name: "Video Streaming Integration", status: "completed" },
  { name: "Code Editor Integration", status: "completed" },
  { name: "Real-time Collaboration", status: "completed" },
  { name: "Payment Integration", status: "completed" },
  { name: "User Interface Design", status: "in-progress" },
  { name: "Frontend Development", status: "in-progress" },
  { name: "Backend API Development", status: "not-started" },
  { name: "Integration and Testing", status: "not-started" },
  { name: "Bug Fixing and Optimization", status: "not-started" },
  { name: "Deployment Preparation", status: "not-started" },
  { name: "User Acceptance Testing", status: "not-started" },
  { name: "Final Adjustments and Launch", status: "not-started" },
];

const categories = [
  "Web Development",
  "Data Science",
  "Mobile Development",
  "Game Development",
  "Machine Learning",
  "DevOps",
  "Cybersecurity",
  "Blockchain",
];

const featuredCourses = [
  {
    id: 1,
    title: "Interactive Python Fundamentals",
    instructor: "Dr. Jane Doe",
    image: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 2,
    title: "Full-Stack JavaScript Mastery",
    instructor: "Prof. John Smith",
    image: "/placeholder.svg?height=150&width=250",
  },
  {
    id: 3,
    title: "Data Structures & Algorithms in C++",
    instructor: "Dr. Emily Brown",
    image: "/placeholder.svg?height=150&width=250",
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalTasks = projectTasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-yellow-100 dark:bg-yellow-900 p-2 text-center">
        <AlertTriangle className="inline-block mr-2" />
        <span className="text-sm font-medium">
          This project is still under development.
        </span>
      </div>
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            CodeNest
          </Link>
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for anything"
                className="w-full pr-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <nav className="hidden md:flex space-x-4 items-center">
            <Link
              href="/courses"
              className="text-sm font-medium hover:text-primary"
            >
              Courses
            </Link>
            <Link
              href="/teach"
              className="text-sm font-medium hover:text-primary"
            >
              Teach
            </Link>
            <Link
              href="/games"
              className="text-sm font-medium hover:text-primary"
            >
              <GamepadIcon className="h-5 w-5" />
            </Link>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/profile">Manage Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout">Log Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:text-primary"
                >
                  Log In
                </Link>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
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
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search for anything"
                    className="w-full pr-10 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                <Link
                  href="/courses"
                  className="text-sm font-medium hover:text-primary"
                >
                  Courses
                </Link>
                <Link
                  href="/teach"
                  className="text-sm font-medium hover:text-primary"
                >
                  Teach
                </Link>
                <Link
                  href="/games"
                  className="text-sm font-medium hover:text-primary flex items-center"
                >
                  <GamepadIcon className="h-5 w-5 mr-2" /> Games
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Manage Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium hover:text-primary"
                    >
                      My Learning
                    </Link>
                    <Link
                      href="/logout"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Log Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-medium hover:text-primary"
                    >
                      Log In
                    </Link>
                    <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="bg-muted py-12 px-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Master Coding through Interactive Learning
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  Join live coding sessions, collaborate in real-time, and build
                  your skills with expert instructors.
                </p>
                <Button size="lg" asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/assets/student_coding.png"
                  alt="Student coding"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Project Progress</h2>
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
            </div>
            <p className="text-center text-lg font-medium mb-8">
              {progress}% Complete
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {task.status === "completed" && (
                    <CheckCircle2 className="text-green-500" />
                  )}
                  {task.status === "in-progress" && (
                    <Clock className="text-yellow-500" />
                  )}
                  {task.status === "not-started" && (
                    <AlertTriangle className="text-gray-400" />
                  )}
                  <span
                    className={
                      task.status === "completed" ? "line-through" : ""
                    }
                  >
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={250}
                      height={150}
                      className="rounded-t-lg w-full"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.instructor}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Top Categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="border rounded-lg overflow-hidden"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-4"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    {expandedCategory === category ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <AnimatePresence>
                    {expandedCategory === category && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-background"
                      >
                        <p>
                          Explore {category} courses and start your learning
                          journey today!
                        </p>
                        <Button className="mt-2" asChild>
                          <Link
                            href={`/courses?category=${encodeURIComponent(
                              category
                            )}`}
                          >
                            View Courses
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Become an Instructor</h2>
            <p className="mb-6">
              Share your coding expertise and inspire the next generation of
              developers.
            </p>
            <Button size="lg" asChild>
              <Link href="/teach">Start Teaching</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-2">CodeNest</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm hover:underline">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Learn</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-sm hover:underline">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/live-sessions"
                    className="text-sm hover:underline"
                  >
                    Live Sessions
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/forums" className="text-sm hover:underline">
                    Forums
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-sm hover:underline">
                    Coding Events
                  </Link>
                </li>
                <li>
                  <Link href="/mentorship" className="text-sm hover:underline">
                    Mentorship
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Project Team</h3>
                <p>Sunny Sharma, Ganesh Jha, Rushikesh Kharat</p>
              </div>
              <div className="text-center mb-4">
                <p>
                  This project was made under the guidance and mentorship of
                  Prof. Akshay Agrawal
                </p>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-12">
            © 2024 CodeNest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
