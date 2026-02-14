"use client";

import { useState } from "react";
import { EloRating } from "./EloRating";

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

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

type SortField = "rank" | "elo" | "wins" | "losses" | "winRate";
type SortDir = "asc" | "desc";

const tierColors: Record<string, string> = {
  Rookie: "text-gray-400 bg-gray-400/10",
  Tosser: "text-corn-green bg-green-400/10",
  Ringer: "text-blue-400 bg-blue-400/10",
  Champion: "text-purple-400 bg-purple-400/10",
  Legend: "text-corn-gold bg-corn-gold/10",
};

export function Leaderboard({ entries }: LeaderboardProps) {
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir(field === "rank" ? "asc" : "desc");
    }
  };

  const sorted = [...entries].sort((a, b) => {
    let aVal: number, bVal: number;

    switch (sortField) {
      case "rank":
        aVal = a.rank;
        bVal = b.rank;
        break;
      case "elo":
        aVal = a.elo;
        bVal = b.elo;
        break;
      case "wins":
        aVal = a.wins;
        bVal = b.wins;
        break;
      case "losses":
        aVal = a.losses;
        bVal = b.losses;
        break;
      case "winRate":
        aVal = a.wins / (a.wins + a.losses || 1);
        bVal = b.wins / (b.wins + b.losses || 1);
        break;
      default:
        aVal = a.rank;
        bVal = b.rank;
    }

    return sortDir === "asc" ? aVal - bVal : bVal - aVal;
  });

  const SortHeader = ({
    field,
    label,
    className = "",
  }: {
    field: SortField;
    label: string;
    className?: string;
  }) => (
    <th
      onClick={() => handleSort(field)}
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-white transition-colors select-none ${className}`}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          <span className="text-corn-gold">
            {sortDir === "asc" ? " ^" : " v"}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#12121a] border-b border-gray-800">
            <tr>
              <SortHeader field="rank" label="Rank" className="w-16" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Player
              </th>
              <SortHeader field="elo" label="ELO" />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tier
              </th>
              <SortHeader field="wins" label="W" />
              <SortHeader field="losses" label="L" />
              <SortHeader field="winRate" label="Win%" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map((entry) => {
              const winRate =
                entry.wins + entry.losses > 0
                  ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(
                      1
                    )
                  : "0.0";
              const tierStyle =
                tierColors[entry.tier] || "text-gray-400 bg-gray-400/10";

              return (
                <tr
                  key={entry.rank}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? "bg-corn-gold/5 border-l-2 border-l-corn-gold"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-bold ${
                        entry.rank <= 3 ? "text-corn-gold" : "text-gray-400"
                      }`}
                    >
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-sm text-white font-medium">
                        {entry.player}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-corn-gold">(You)</span>
                      )}
                      <div className="text-xs text-gray-600 font-mono">
                        {entry.wallet}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-white font-mono font-semibold">
                      {entry.elo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${tierStyle}`}
                    >
                      {entry.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-corn-green">
                    {entry.wins}
                  </td>
                  <td className="px-4 py-3 text-sm text-corn-red">
                    {entry.losses}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    {winRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
