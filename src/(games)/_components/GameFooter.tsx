"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Heart, Star, Send } from "lucide-react";

export function GameFooter() {
  const { theme } = useTheme();

  const footerSections = [
    {
      title: "Play",
      links: ["All Games", "New Games", "Popular Games", "Game Jams"],
    },
    {
      title: "Learn",
      links: ["Tutorials", "Code Challenges", "Game Dev Blog", "FAQ"],
    },
    {
      title: "Community",
      links: ["Forums", "Discord", "Events", "Leaderboards"],
    },
  ];

  return (
    <footer
      className={`bg-background border-t border-border ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li
                    key={link}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href="#"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Stay Connected
            </h3>
            <p className="mb-4 text-foreground/80">
              Join our newsletter for game updates and coding tips!
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CodeNest Games
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5 text-red-500" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
                <Star className="h-5 w-5 text-yellow-500" />
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-foreground/60">
          © 2024 CodeNest Games. All rights reserved. Made with 💖 for young
          coders!
        </div>
      </div>
    </footer>
  );
}
