"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gamepad2, Users, Brain, Trophy, Sparkles } from "lucide-react";
import { GameNavbar } from "@/(games)/_components/GameNavbar";
import { GameFooter } from "@/(games)/_components/GameFooter";

const gameCategories = [
  {
    id: "normal",
    name: "Learning Games",
    icon: Gamepad2,
    color: "from-pink-500 to-purple-500",
  },
  {
    id: "live",
    name: "Live Competitions",
    icon: Users,
    color: "from-green-500 to-teal-500",
  },
  {
    id: "quiz",
    name: "Coding Quizzes",
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
  },
];

const games = [
  {
    id: 1,
    name: "Code Blocks",
    category: "normal",
    description: "Learn programming basics by arranging code blocks",
    language: "Multiple",
    difficulty: "Beginner",
    color: "from-yellow-300 to-orange-400",
    link: "/code-blocks",
  },
  {
    id: 2,
    name: "Python Adventure",
    category: "normal",
    description: "Explore a magical world while learning Python",
    language: "Python",
    difficulty: "Beginner",
    color: "from-blue-300 to-purple-400",
    link: "/python-adventure",
  },
  {
    id: 3,
    name: "C++ Space Race",
    category: "live",
    description: "Compete in real-time space race using C++",
    language: "C++",
    difficulty: "Intermediate",
    color: "from-red-300 to-pink-400",
    link: "/cpp-space-race",
  },
  {
    id: 4,
    name: "Java Jigsaw",
    category: "normal",
    description: "Solve coding puzzles to learn Java concepts",
    language: "Java",
    difficulty: "Beginner",
    color: "from-green-300 to-teal-400",
    link: "/java-jigsaw",
  },
  {
    id: 5,
    name: "Algorithm Arena",
    category: "live",
    description: "Battle other coders in algorithmic challenges",
    language: "Multiple",
    difficulty: "Advanced",
    color: "from-purple-300 to-indigo-400",
  },
  {
    id: 6,
    name: "Python Trivia",
    category: "quiz",
    description: "Test your Python knowledge with quick-fire questions",
    language: "Python",
    difficulty: "Intermediate",
    color: "from-yellow-300 to-green-400",
  },
  {
    id: 7,
    name: "C Syntax Sprint",
    category: "quiz",
    description: "Race against time to identify correct C syntax",
    language: "C",
    difficulty: "Beginner",
    color: "from-orange-300 to-red-400",
  },
  {
    id: 8,
    name: "OOP Olympics",
    category: "live",
    description: "Compete in object-oriented programming challenges",
    language: "Multiple",
    difficulty: "Intermediate",
    color: "from-blue-300 to-cyan-400",
  },
];

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{ x: position.x - 16, y: position.y - 16 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <Sparkles className="w-full h-full text-white" />
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
    <motion.div
      className="w-16 h-16 border-4 border-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState("normal");
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredGames = games.filter(
    (game) => game.category === selectedCategory
  );

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <CustomCursor />
      <GameNavbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          CodeNest Games Galaxy
        </motion.h1>
        <Tabs
          defaultValue="normal"
          className="w-full"
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {gameCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white`
                    : ""
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <AnimatePresence mode="wait">
            {gameCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`overflow-hidden ${
                          theme === "dark" ? "bg-gray-800" : "bg-white"
                        } transition-colors duration-300`}
                      >
                        <CardHeader
                          className={`bg-gradient-to-r ${game.color} text-white`}
                        >
                          <CardTitle className="flex items-center justify-between">
                            {game.name}
                            {category.id === "live" && (
                              <Badge
                                variant="destructive"
                                className="animate-pulse"
                              >
                                LIVE
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-100">
                            {game.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-4">
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary">{game.language}</Badge>
                            <Badge variant="outline">{game.difficulty}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                            onClick={handleConfetti}
                          >
                            <Link href={`/games/${game.link}`}>
                              {category.id === "live"
                                ? "Join Game"
                                : "Play Now"}
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
        {selectedCategory === "live" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Leaderboard Champions
              </span>
            </h2>
            <Card
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } transition-colors duration-300`}
            >
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="font-medium p-2">Rank</th>
                        <th className="font-medium p-2">Player</th>
                        <th className="font-medium p-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(10)].map((_, index) => (
                        <motion.tr
                          key={index}
                          className="border-t"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">CodeMaster{index + 1}</td>
                          <td className="p-2">{1000 - index * 50}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
      <GameFooter />
    </div>
  );
}
