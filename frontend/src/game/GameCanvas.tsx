"use client";

import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { createGameConfig } from "./config";

interface GameCanvasProps {
  matchId: string;
}

export default function GameCanvas({ matchId }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Only create game once
    if (gameRef.current) return;

    const config = createGameConfig("game-container");
    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [matchId]);

  return null;
}
