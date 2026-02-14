"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { MatchmakingQueue } from "@/components/MatchmakingQueue";
import { useMatchmaking } from "@/hooks/useMatchmaking";

type GameMode = "casual" | "ranked" | "high-roller" | "practice";

const modes: {
  id: GameMode;
  title: string;
  description: string;
  wager: string;
  icon: string;
  requiresWallet: boolean;
}[] = [
  {
    id: "practice",
    title: "Practice",
    description:
      "Hone your skills against an AI opponent. No wager, no pressure. Perfect for learning the ropes.",
    wager: "Free",
    icon: "🎯",
    requiresWallet: false,
  },
  {
    id: "casual",
    title: "Casual",
    description:
      "Laid-back matches with low stakes. Great for warming up or playing for fun with small wagers.",
    wager: "10 $CORN",
    icon: "🌽",
    requiresWallet: true,
  },
  {
    id: "ranked",
    title: "Ranked",
    description:
      "Competitive matches that affect your ELO rating. Climb the leaderboard and prove your skill.",
    wager: "50 $CORN",
    icon: "🏆",
    requiresWallet: true,
  },
  {
    id: "high-roller",
    title: "High Roller",
    description:
      "High-stakes matches for experienced players. Big wagers, big rewards, big bragging rights.",
    wager: "500 $CORN",
    icon: "💎",
    requiresWallet: true,
  },
];

export default function PlayPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const { isSearching, timeInQueue, matchId, joinQueue, leaveQueue } =
    useMatchmaking();

  const handleSelectMode = (mode: GameMode) => {
    if (mode !== "practice" && !connected) {
      return;
    }
    setSelectedMode(mode);
  };

  const handleStartQueue = () => {
    if (!selectedMode) return;
    joinQueue(selectedMode);
  };

  const handleCancelQueue = () => {
    leaveQueue();
    setSelectedMode(null);
  };

  // Redirect when match is found
  if (matchId) {
    router.push(`/match/${matchId}`);
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Mode</h1>
        <p className="text-gray-400">
          Select a game mode to start matchmaking
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="queue"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto"
          >
            <MatchmakingQueue
              mode={selectedMode || "casual"}
              timeInQueue={timeInQueue}
              onCancel={handleCancelQueue}
            />
          </motion.div>
        ) : (
          <motion.div
            key="modes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {modes.map((mode) => {
              const disabled = mode.requiresWallet && !connected;
              return (
                <motion.div
                  key={mode.id}
                  whileHover={disabled ? {} : { scale: 1.02 }}
                  whileTap={disabled ? {} : { scale: 0.98 }}
                  onClick={() => handleSelectMode(mode.id)}
                  className={`card cursor-pointer relative overflow-hidden ${
                    selectedMode === mode.id
                      ? "border-corn-gold ring-2 ring-corn-gold/30"
                      : ""
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{mode.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold text-white">
                          {mode.title}
                        </h3>
                        <span className="text-corn-gold text-sm font-semibold">
                          {mode.wager}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {mode.description}
                      </p>
                      {disabled && (
                        <p className="text-corn-red text-xs mt-2">
                          Connect wallet to play this mode
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Queue Button */}
      {selectedMode && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <button onClick={handleStartQueue} className="btn-primary text-lg px-12 py-4">
            Find Match
          </button>
        </motion.div>
      )}
    </div>
  );
}
