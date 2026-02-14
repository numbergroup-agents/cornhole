"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket, useSocketEvent } from "./useSocket";
import { useGameStore, Player } from "@/stores/gameStore";
import crypto from "crypto";

interface MatchState {
  matchId: string;
  players: Player[];
  scores: number[];
  status: string;
  round: number;
  bagsRemaining: number;
  wager: number;
}

interface ThrowEvent {
  player: string;
  round: number;
  throwIndex: number;
  angle: number;
  power: number;
  result: "miss" | "board" | "hole";
  points: number;
}

interface MatchResult {
  winner: string;
  scores: number[];
}

export function useMatch(matchId: string) {
  const { socket, connected } = useSocket();
  const gameStore = useGameStore();
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Join match room on mount
  useEffect(() => {
    if (!socket || !connected || !matchId) return;

    socket.emit("match:join", { matchId });

    // Request current match state
    socket.emit("match:state", { matchId });

    return () => {
      socket.emit("match:leave", { matchId });
    };
  }, [socket, connected, matchId]);

  // Listen for match state updates
  useSocketEvent<MatchState>("match:state", (data) => {
    setMatchState(data);
    setIsLoading(false);

    gameStore.setMatch({
      matchId: data.matchId,
      players: data.players,
      mode: "casual",
      wager: data.wager,
    });
    gameStore.updateScores(data.scores);
  });

  // Listen for throw events from opponent
  useSocketEvent<ThrowEvent>("match:throw", (data) => {
    gameStore.addThrow(data);
    const newScores = [...gameStore.scores];
    const playerIndex = gameStore.players.findIndex(
      (p) => p.wallet === data.player
    );
    if (playerIndex >= 0) {
      newScores[playerIndex] += data.points;
      gameStore.updateScores(newScores);
    }
  });

  // Listen for turn changes
  useSocketEvent<{ player: string }>("match:turn", (data) => {
    const isMyTurn =
      data.player === gameStore.players[0]?.wallet;
    gameStore.setMyTurn(isMyTurn);
  });

  // Listen for match end
  useSocketEvent<MatchResult>("match:end", (data) => {
    gameStore.endMatch(data.scores);
  });

  // Listen for errors
  useSocketEvent<{ message: string }>("match:error", (data) => {
    setError(data.message);
    setIsLoading(false);
  });

  /**
   * Commits a throw using commit-reveal scheme.
   * Sends a hash of the throw parameters, then reveals after opponent commits.
   */
  const commitThrow = useCallback(
    (angle: number, power: number) => {
      if (!socket || !matchId) return;

      // Generate nonce for commit-reveal
      const nonce = Math.random().toString(36).substring(2, 15);

      // Create commit hash (angle + power + nonce)
      const commitData = `${angle}:${power}:${nonce}`;
      const hash = btoa(commitData); // Simple encoding; real impl would use SHA-256

      // Store reveal data locally
      sessionStorage.setItem(
        `throw_${matchId}_reveal`,
        JSON.stringify({ angle, power, nonce })
      );

      // Send commit
      socket.emit("match:commit_throw", {
        matchId,
        hash,
      });

      // For now, auto-reveal after a short delay (in production, wait for both commits)
      setTimeout(() => {
        revealThrow(angle, power, nonce);
      }, 500);
    },
    [socket, matchId]
  );

  /**
   * Reveals the throw parameters after commit phase.
   */
  const revealThrow = useCallback(
    (angle: number, power: number, nonce: string) => {
      if (!socket || !matchId) return;

      socket.emit("match:reveal_throw", {
        matchId,
        angle,
        power,
        spin: 0,
        nonce,
      });
    },
    [socket, matchId]
  );

  return {
    matchState,
    isLoading,
    error,
    commitThrow,
    revealThrow,
  };
}
