"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MatchmakingQueueProps {
  mode: string;
  timeInQueue: number;
  onCancel: () => void;
}

const modeLabels: Record<string, string> = {
  casual: "Casual",
  ranked: "Ranked",
  "high-roller": "High Roller",
  practice: "Practice",
};

export function MatchmakingQueue({
  mode,
  timeInQueue,
  onCancel,
}: MatchmakingQueueProps) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="card text-center">
      {/* Searching animation */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-5xl mb-6"
      >
        🌽
      </motion.div>

      <h2 className="text-xl font-bold text-white mb-2">
        Searching for Match{dots}
      </h2>

      <div className="text-sm text-gray-400 mb-1">
        Mode:{" "}
        <span className="text-corn-gold font-medium">
          {modeLabels[mode] || mode}
        </span>
      </div>

      <div className="text-2xl font-mono text-white my-4">
        {formatTime(timeInQueue)}
      </div>

      {/* Pulsing dots */}
      <div className="flex justify-center gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-3 h-3 rounded-full bg-corn-gold"
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Matching you with a player of similar skill level
      </p>

      <button onClick={onCancel} className="btn-danger">
        Cancel Search
      </button>
    </div>
  );
}
