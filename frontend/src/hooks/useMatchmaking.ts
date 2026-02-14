"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket, useSocketEvent } from "./useSocket";

interface MatchFoundEvent {
  matchId: string;
  opponent: string;
  mode: string;
}

/**
 * Hook for managing the matchmaking queue.
 * Handles joining/leaving the queue and listening for match found events.
 */
export function useMatchmaking() {
  const { socket, connected } = useSocket();
  const [isSearching, setIsSearching] = useState(false);
  const [timeInQueue, setTimeInQueue] = useState(0);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for queue duration
  useEffect(() => {
    if (isSearching) {
      setTimeInQueue(0);
      timerRef.current = setInterval(() => {
        setTimeInQueue((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSearching]);

  // Listen for match found
  useSocketEvent<MatchFoundEvent>("matchmaking:found", (data) => {
    setIsSearching(false);
    setMatchId(data.matchId);
  });

  // Listen for queue status updates
  useSocketEvent<{ status: string }>("matchmaking:status", (data) => {
    if (data.status === "searching") {
      setIsSearching(true);
    } else if (data.status === "cancelled") {
      setIsSearching(false);
    }
  });

  /**
   * Join the matchmaking queue for a given mode.
   */
  const joinQueue = useCallback(
    (mode: string) => {
      if (!socket || !connected) {
        console.warn("[Matchmaking] Socket not connected");
        return;
      }

      setCurrentMode(mode);
      setIsSearching(true);
      setMatchId(null);

      socket.emit("matchmaking:join", { mode });

      // Also make an API call as backup
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/matchmaking/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode }),
        }
      ).catch((err) => {
        console.warn("[Matchmaking] API call failed:", err);
      });
    },
    [socket, connected]
  );

  /**
   * Leave the matchmaking queue.
   */
  const leaveQueue = useCallback(() => {
    if (socket && connected) {
      socket.emit("matchmaking:leave", {});
    }

    // Also make an API call as backup
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/matchmaking/leave`,
      { method: "DELETE" }
    ).catch(() => {});

    setIsSearching(false);
    setCurrentMode(null);
    setTimeInQueue(0);
  }, [socket, connected]);

  return {
    isSearching,
    timeInQueue,
    matchId,
    currentMode,
    joinQueue,
    leaveQueue,
  };
}
