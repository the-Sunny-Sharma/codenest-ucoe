import React, { useState, useEffect } from "react";
import { CodeBlock } from "./CodeBlock";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface GameBoardProps {
  level: {
    code: string[];
    solution: string[];
  };
  onLevelComplete: () => void;
}

export function GameBoard({ level, onLevelComplete }: GameBoardProps) {
  const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setCodeBlocks(shuffleArray([...level.code]));
  }, [level]);

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleBlockMove = (dragIndex: number, hoverIndex: number) => {
    const draggedBlock = codeBlocks[dragIndex];
    const newBlocks = [...codeBlocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, draggedBlock);
    setCodeBlocks(newBlocks);
  };

  const handleCheck = () => {
    const isCorrect =
      JSON.stringify(codeBlocks) === JSON.stringify(level.solution);
    setIsCorrect(isCorrect);
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(onLevelComplete, 2000);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
        {codeBlocks.map((block, index) => (
          <CodeBlock
            key={index}
            index={index}
            text={block}
            moveBlock={handleBlockMove}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={handleCheck} size="lg">
          Check Solution
        </Button>
      </div>
      {isCorrect !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg text-center ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect
            ? "Great job! You solved it!"
            : "Not quite right. Try again!"}
        </motion.div>
      )}
    </div>
  );
}
