"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Home,
  BookOpen,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTeacherStatus = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get("/api/teacher/status");
          if (response.data.success) {
            setIsLoading(false);
          } else {
            router.push("/teach");
          }
        } catch (error: any) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error("User not found. Please sign up.");
              router.push("/signup");
            } else if (error.response.status === 403) {
              toast.error("You are not registered as a teacher.");
              router.push("/teach");
            } else {
              toast.error("An error occurred. Please try again.");
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
          console.error("Error checking teacher status:", error);
        }
      }
    };

    checkTeacherStatus();
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <LoadingSkeleton />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const sidebarItems = [
    { icon: <Home size={24} />, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen size={24} />, label: "Courses", href: "/my-courses" },
    { icon: <Users size={24} />, label: "Students", href: "/students" },
    { icon: <Calendar size={24} />, label: "Schedule", href: "/schedule" },
    { icon: <Settings size={24} />, label: "Settings", href: "/settings" },
  ];

  const handleLogout = () => {
    // Implement logout logic here
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        className={`bg-card text-card-foreground ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-4 flex items-center justify-center h-16">
          <AnimatePresence>
            {isSidebarOpen ? (
              <motion.h1
                key="logo-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold"
              >
                CodeNest
              </motion.h1>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -180 }}
                transition={{ duration: 0.3 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <motion.span
                    className="flex items-center p-4 hover:bg-accent"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          variant="ghost"
          className="flex items-center p-4 w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut size={24} />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="ml-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-card text-card-foreground shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ChevronLeft size={24} />
              </Button>
              <h1 className="text-2xl font-bold">{getPageTitle(pathname)}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session?.user?.image || undefined}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex h-screen bg-background">
    <div className="w-20 bg-card">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="flex-1 flex flex-col">
      <Skeleton className="h-16 w-full" />
      <div className="flex-1 p-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const getPageTitle = (pathname: string) => {
  const titles: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/courses": "Courses",
    "/students": "Students",
    "/schedule": "Schedule",
    "/settings": "Settings",
  };
  return titles[pathname] || "CodeNest Teacher Dashboard";
};

export default TeacherLayout;
