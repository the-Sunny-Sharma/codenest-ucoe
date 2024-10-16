"use client";

import React, { useState } from "react";
import { GameBoard } from "@/components/JavaJigsaw/GameBoard";
import { LevelInfo } from "@/components/JavaJigsaw/LevelInfo";
import { ProgressBar } from "@/components/JavaJigsaw/ProgressBar";
import { levels } from "@/lib/javaJigsawLevels";

export default function JavaJigsawGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);

  const handleLevelComplete = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setScore(score + 100);
    } else {
      alert("Congratulations! You've completed all levels!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-300">
        Java Jigsaw
      </h1>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <ProgressBar
          currentLevel={currentLevel}
          totalLevels={levels.length}
          score={score}
        />
        <LevelInfo level={levels[currentLevel]} />
        <GameBoard
          level={levels[currentLevel]}
          onLevelComplete={handleLevelComplete}
        />
      </div>
    </div>
  );
}
