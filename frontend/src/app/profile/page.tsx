"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { EloRating } from "@/components/EloRating";
import { MatchCard } from "@/components/MatchCard";
import { CosmeticCard } from "@/components/CosmeticCard";
import { useUserStore } from "@/stores/userStore";

const mockMatchHistory = [
  {
    id: "m1",
    mode: "ranked" as const,
    opponent: "TossLord42",
    myScore: 21,
    opponentScore: 15,
    result: "win" as const,
    wager: 50,
    date: "2026-02-05",
  },
  {
    id: "m2",
    mode: "casual" as const,
    opponent: "BagSlinger",
    myScore: 18,
    opponentScore: 21,
    result: "loss" as const,
    wager: 10,
    date: "2026-02-04",
  },
  {
    id: "m3",
    mode: "ranked" as const,
    opponent: "CornFarmer",
    myScore: 21,
    opponentScore: 21,
    result: "draw" as const,
    wager: 50,
    date: "2026-02-03",
  },
  {
    id: "m4",
    mode: "high-roller" as const,
    opponent: "GoldenArm",
    myScore: 21,
    opponentScore: 9,
    result: "win" as const,
    wager: 500,
    date: "2026-02-02",
  },
];

const mockCosmetics = [
  { id: "c1", name: "Golden Bag", type: "Bag" as const, rarity: "Legendary" as const, equipped: true, imageUrl: "" },
  { id: "c2", name: "Corn Field Board", type: "Board" as const, rarity: "Rare" as const, equipped: true, imageUrl: "" },
  { id: "c3", name: "Fire Trail", type: "Trail" as const, rarity: "Epic" as const, equipped: false, imageUrl: "" },
  { id: "c4", name: "Scarecrow Avatar", type: "Avatar" as const, rarity: "Common" as const, equipped: true, imageUrl: "" },
];

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const { username, elo, tier, wins, losses } = useUserStore();
  const [editingName, setEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const walletAddress = publicKey?.toBase58() || "Not connected";
  const truncatedAddress = publicKey
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : "Not connected";
  const winRate =
    wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : "0.0";

  const handleSaveUsername = () => {
    useUserStore.getState().setUser({ username: newUsername });
    setEditingName(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* ELO Badge */}
            <EloRating elo={elo} tier={tier} />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="input-field text-lg py-1 px-3"
                      maxLength={20}
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="text-corn-gold hover:text-yellow-400 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">
                      {username || "Anonymous"}
                    </h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-gray-500 hover:text-corn-gold text-sm"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-4 font-mono">
                {truncatedAddress}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-corn-green">
                    {wins}
                  </div>
                  <div className="text-xs text-gray-500">Wins</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-corn-red">
                    {losses}
                  </div>
                  <div className="text-xs text-gray-500">Losses</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {winRate}%
                  </div>
                  <div className="text-xs text-gray-500">Win Rate</div>
                </div>
                <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-corn-gold">{elo}</div>
                  <div className="text-xs text-gray-500">ELO</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipped Cosmetics */}
        <h2 className="text-xl font-bold text-white mb-4">
          Equipped Cosmetics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {mockCosmetics
            .filter((c) => c.equipped)
            .map((cosmetic) => (
              <CosmeticCard
                key={cosmetic.id}
                cosmetic={cosmetic}
                onEquip={() => {}}
                showPrice={false}
              />
            ))}
        </div>

        {/* Match History */}
        <h2 className="text-xl font-bold text-white mb-4">Match History</h2>
        <div className="space-y-3">
          {mockMatchHistory.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
