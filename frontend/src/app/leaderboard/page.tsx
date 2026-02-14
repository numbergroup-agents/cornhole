"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaderboard } from "@/components/Leaderboard";

export interface LeaderboardEntry {
  rank: number;
  player: string;
  wallet: string;
  elo: number;
  tier: string;
  wins: number;
  losses: number;
  isCurrentUser: boolean;
}

const mockData: LeaderboardEntry[] = [
  { rank: 1, player: "CornKing.sol", wallet: "Corn...KinG", elo: 2150, tier: "Legend", wins: 342, losses: 58, isCurrentUser: false },
  { rank: 2, player: "RingerChamp", wallet: "Ring...ChmP", elo: 2080, tier: "Legend", wins: 298, losses: 72, isCurrentUser: false },
  { rank: 3, player: "GoldenArm", wallet: "Gold...nArm", elo: 1950, tier: "Champion", wins: 256, losses: 84, isCurrentUser: false },
  { rank: 4, player: "TossLord42", wallet: "Toss...rd42", elo: 1890, tier: "Champion", wins: 230, losses: 95, isCurrentUser: false },
  { rank: 5, player: "HoleInOne", wallet: "Hole...nOne", elo: 1820, tier: "Champion", wins: 210, losses: 102, isCurrentUser: false },
  { rank: 6, player: "BagSlinger", wallet: "BagS...nger", elo: 1760, tier: "Ringer", wins: 188, losses: 110, isCurrentUser: false },
  { rank: 7, player: "CornFarmer", wallet: "Corn...rmer", elo: 1700, tier: "Ringer", wins: 175, losses: 120, isCurrentUser: false },
  { rank: 8, player: "You", wallet: "Your...Wall", elo: 1650, tier: "Ringer", wins: 160, losses: 130, isCurrentUser: true },
  { rank: 9, player: "SlideMaster", wallet: "Slid...ster", elo: 1600, tier: "Ringer", wins: 148, losses: 135, isCurrentUser: false },
  { rank: 10, player: "NewbieToss", wallet: "Newb...Toss", elo: 1200, tier: "Tosser", wins: 45, losses: 80, isCurrentUser: false },
];

const seasons = ["Season 1 (Current)", "Preseason"];

export default function LeaderboardPage() {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400">
          Top players ranked by ELO rating
        </p>
      </motion.div>

      {/* Season Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {seasons.map((season) => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSeason === season
                ? "bg-corn-gold text-black"
                : "bg-[#1a1a2e] text-gray-400 hover:text-white"
            }`}
          >
            {season}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Leaderboard entries={mockData} />
    </div>
  );
}
