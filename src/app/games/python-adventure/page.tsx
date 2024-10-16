"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const Game = dynamic(() => import("@/components/PythonAdventure/Game"), {
  ssr: false,
});

export default function PythonAdventurePage() {
  const [gameStarted, setGameStarted] = React.useState(false);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
        <h1 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">
          Python Adventure
        </h1>
        <p className="text-lg mb-8 text-center max-w-md">
          Embark on an epic journey through the land of Pythonia, where you'll
          learn Python programming while battling bugs and solving puzzles!
        </p>
        <Button onClick={() => setGameStarted(true)} size="lg">
          Start Adventure
        </Button>
      </div>
    );
  }

  return <Game />;
}
