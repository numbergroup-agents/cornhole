"use client";

import Link from "next/link";

interface MatchData {
  id: string;
  mode: "casual" | "ranked" | "high-roller" | "practice";
  opponent: string;
  myScore: number;
  opponentScore: number;
  result: "win" | "loss" | "draw";
  wager: number;
  date: string;
}

interface MatchCardProps {
  match: MatchData;
}

const resultColors = {
  win: "border-l-corn-green",
  loss: "border-l-corn-red",
  draw: "border-l-corn-gold",
};

const resultLabels = {
  win: { text: "WIN", color: "text-corn-green" },
  loss: { text: "LOSS", color: "text-corn-red" },
  draw: { text: "DRAW", color: "text-corn-gold" },
};

const modeLabels: Record<string, string> = {
  casual: "Casual",
  ranked: "Ranked",
  "high-roller": "High Roller",
  practice: "Practice",
};

export function MatchCard({ match }: MatchCardProps) {
  const resultStyle = resultLabels[match.result];
  const cornChange =
    match.result === "win"
      ? `+${match.wager}`
      : match.result === "loss"
      ? `-${match.wager}`
      : "0";
  const cornColor =
    match.result === "win"
      ? "text-corn-green"
      : match.result === "loss"
      ? "text-corn-red"
      : "text-gray-400";

  return (
    <Link href={`/match/${match.id}`}>
      <div
        className={`bg-[#1a1a2e] rounded-lg border border-gray-800 border-l-4 ${
          resultColors[match.result]
        } p-4 hover:border-gray-600 transition-all cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Result badge */}
            <span
              className={`text-xs font-bold ${resultStyle.color} w-10`}
            >
              {resultStyle.text}
            </span>

            {/* Opponent and score */}
            <div>
              <div className="text-white font-medium">
                vs {match.opponent}
              </div>
              <div className="text-gray-500 text-sm">
                {match.myScore} - {match.opponentScore}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-sm font-semibold ${cornColor}`}>
              {cornChange} $CORN
            </div>
            <div className="text-xs text-gray-500">
              {modeLabels[match.mode]} | {match.date}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
