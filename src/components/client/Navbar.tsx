"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { GamepadIcon, Menu, Moon, Sun, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          CodeNest
        </Link>
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>
        <nav className="hidden md:flex space-x-4 items-center">
          <Link
            href="/courses"
            className="text-sm font-medium hover:text-primary"
          >
            Courses
          </Link>
          <Link
            href="/dashboard"
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
              <SearchBar />
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
  );
}
