import React from "react";
import { motion } from "framer-motion";

interface LevelInfoProps {
  level: {
    title: string;
    description: string;
  };
}

export function LevelInfo({ level }: LevelInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4"
    >
      <h2 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-300">
        {level.title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{level.description}</p>
    </motion.div>
  );
}
