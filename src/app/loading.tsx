"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  const circleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center">
        <motion.div
          className="flex justify-center space-x-2 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-4 h-4 rounded-full ${
                theme === "dark" ? "bg-primary" : "bg-primary"
              }`}
              variants={circleVariants}
              initial="start"
              animate="end"
              transition={{
                ...transition,
                delay: index * 0.15,
              }}
            />
          ))}
        </motion.div>
        <motion.h2
          className="text-2xl font-semibold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Loading...
        </motion.h2>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Preparing your coding adventure
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
