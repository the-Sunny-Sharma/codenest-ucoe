"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { GamepadIcon, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

interface CurrentUser {
  name: string;
  profilePicture: string;
}

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          {!session ? (
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
