"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

type TournamentStatus = "upcoming" | "active" | "completed";

interface Tournament {
  id: string;
  name: string;
  format: "single" | "double";
  buyIn: number;
  prizePool: number;
  playerCount: number;
  maxPlayers: number;
  status: TournamentStatus;
  startTime: string;
}

const mockTournaments: Tournament[] = [
  {
    id: "t1",
    name: "Corn Classic Weekly",
    format: "single",
    buyIn: 100,
    prizePool: 5000,
    playerCount: 32,
    maxPlayers: 64,
    status: "upcoming",
    startTime: "2026-02-10T18:00:00Z",
  },
  {
    id: "t2",
    name: "High Roller Invitational",
    format: "double",
    buyIn: 1000,
    prizePool: 25000,
    playerCount: 16,
    maxPlayers: 16,
    status: "active",
    startTime: "2026-02-05T14:00:00Z",
  },
  {
    id: "t3",
    name: "Rookie Rumble",
    format: "single",
    buyIn: 25,
    prizePool: 800,
    playerCount: 32,
    maxPlayers: 32,
    status: "completed",
    startTime: "2026-02-01T18:00:00Z",
  },
  {
    id: "t4",
    name: "Golden Toss Championship",
    format: "double",
    buyIn: 500,
    prizePool: 15000,
    playerCount: 8,
    maxPlayers: 32,
    status: "upcoming",
    startTime: "2026-02-15T20:00:00Z",
  },
  {
    id: "t5",
    name: "Community Cup #12",
    format: "single",
    buyIn: 50,
    prizePool: 2500,
    playerCount: 64,
    maxPlayers: 64,
    status: "active",
    startTime: "2026-02-04T16:00:00Z",
  },
];

const statusColors: Record<TournamentStatus, string> = {
  upcoming: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  active: "text-corn-green bg-green-400/10 border-green-400/30",
  completed: "text-gray-400 bg-gray-400/10 border-gray-400/30",
};

export default function TournamentsPage() {
  const { connected } = useWallet();
  const [filter, setFilter] = useState<TournamentStatus | "all">("all");

  const filtered =
    filter === "all"
      ? mockTournaments
      : mockTournaments.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Tournaments</h1>
        <p className="text-gray-400">
          Enter bracket competitions and compete for prize pools
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-8">
        {(["all", "upcoming", "active", "completed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? "bg-corn-gold text-black"
                : "bg-[#1a1a2e] text-gray-400 hover:text-white"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tournament Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tournament, index) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-white">
                {tournament.name}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  statusColors[tournament.status]
                }`}
              >
                {tournament.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Format</span>
                <span className="text-white capitalize">
                  {tournament.format} elimination
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Buy-in</span>
                <span className="text-corn-gold">
                  {tournament.buyIn} $CORN
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Prize Pool</span>
                <span className="text-corn-gold font-semibold">
                  {tournament.prizePool.toLocaleString()} $CORN
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Players</span>
                <span className="text-white">
                  {tournament.playerCount}/{tournament.maxPlayers}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Start</span>
                <span className="text-white">
                  {new Date(tournament.startTime).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Progress bar for player count */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
              <div
                className="bg-corn-gold h-1.5 rounded-full transition-all"
                style={{
                  width: `${
                    (tournament.playerCount / tournament.maxPlayers) * 100
                  }%`,
                }}
              />
            </div>

            <div className="flex gap-2">
              <Link
                href={`/tournaments/${tournament.id}`}
                className="flex-1 text-center py-2 rounded-lg bg-[#0a0a0f] text-gray-300 hover:text-white text-sm transition-colors"
              >
                View Bracket
              </Link>
              {tournament.status === "upcoming" && (
                <button
                  disabled={!connected}
                  className="flex-1 py-2 rounded-lg bg-corn-gold text-black font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors"
                >
                  Register
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          No tournaments found for this filter.
        </div>
      )}
    </div>
  );
}
