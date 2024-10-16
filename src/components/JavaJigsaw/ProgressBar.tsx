import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentLevel: number;
  totalLevels: number;
  score: number;
}

export function ProgressBar({
  currentLevel,
  totalLevels,
  score,
}: ProgressBarProps) {
  const progress = ((currentLevel + 1) / totalLevels) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Level {currentLevel + 1}/{totalLevels}
        </span>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          Score: {score}
        </span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
}
