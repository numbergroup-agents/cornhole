"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreBoard } from "@/components/ScoreBoard";
import { ThrowControls } from "@/components/ThrowControls";
import { useMatch } from "@/hooks/useMatch";
import { useGameStore } from "@/stores/gameStore";

const GameCanvas = dynamic(() => import("@/game/GameCanvas"), { ssr: false });

export default function MatchPage() {
  const params = useParams();
  const matchId = params.id as string;
  const {
    matchState,
    commitThrow,
    revealThrow,
    isLoading,
    error,
  } = useMatch(matchId);
  const { status, players, scores, currentRound, myTurn, wind } = useGameStore();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (status === "completed") {
      const timer = setTimeout(() => setShowResult(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce-slow">🌽</div>
          <p className="text-gray-400">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-xl font-bold text-corn-red mb-2">Match Error</h2>
          <p className="text-gray-400">{error}</p>
          <a href="/play" className="btn-primary inline-block mt-4">
            Back to Lobby
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-4">
      {/* Score Board */}
      <ScoreBoard
        player1={{
          name: players[0]?.username || "Player 1",
          score: scores[0] || 0,
        }}
        player2={{
          name: players[1]?.username || "Player 2",
          score: scores[1] || 0,
        }}
        currentRound={currentRound}
        bagsRemaining={matchState?.bagsRemaining ?? 4}
      />

      {/* Game Canvas */}
      <div className="game-container my-4">
        <div id="game-container" className="w-full h-full" />
        <GameCanvas matchId={matchId} />
      </div>

      {/* Throw Controls Overlay */}
      {myTurn && status === "active" && (
        <ThrowControls
          wind={wind}
          onThrow={(angle: number, power: number) => {
            commitThrow(angle, power);
          }}
        />
      )}

      {/* Turn Indicator */}
      <AnimatePresence>
        {status === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4"
          >
            <span
              className={`text-lg font-bold ${
                myTurn ? "text-corn-gold" : "text-gray-400"
              }`}
            >
              {myTurn ? "Your Turn - Aim and Throw!" : "Opponent's Turn..."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card max-w-lg w-full text-center"
            >
              <div className="text-5xl mb-4">
                {scores[0] > scores[1] ? "🏆" : "😔"}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {scores[0] > scores[1]
                  ? "Victory!"
                  : scores[0] < scores[1]
                  ? "Defeat"
                  : "Draw"}
              </h2>
              <div className="text-xl text-gray-300 mb-6">
                {scores[0]} - {scores[1]}
              </div>
              <div className="text-corn-gold text-lg mb-8">
                {scores[0] > scores[1]
                  ? `+${matchState?.wager || 0} $CORN`
                  : scores[0] < scores[1]
                  ? `-${matchState?.wager || 0} $CORN`
                  : "No change"}
              </div>
              <div className="flex gap-4 justify-center">
                <a href="/play" className="btn-primary">
                  Play Again
                </a>
                <a href="/" className="btn-secondary">
                  Return to Lobby
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
