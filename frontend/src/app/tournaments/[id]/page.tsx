"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { TournamentBracket } from "@/components/TournamentBracket";

interface BracketMatch {
  id: string;
  round: number;
  position: number;
  player1: string | null;
  player2: string | null;
  score1: number | null;
  score2: number | null;
  winner: string | null;
}

const mockBracketData: BracketMatch[] = [
  // Round 1 (Quarterfinals)
  { id: "m1", round: 1, position: 0, player1: "CornKing.sol", player2: "TossLord42", score1: 21, score2: 15, winner: "CornKing.sol" },
  { id: "m2", round: 1, position: 1, player1: "BagSlinger", player2: "HoleInOne", score1: 18, score2: 21, winner: "HoleInOne" },
  { id: "m3", round: 1, position: 2, player1: "GoldenArm", player2: "CornFarmer", score1: 21, score2: 12, winner: "GoldenArm" },
  { id: "m4", round: 1, position: 3, player1: "RingerChamp", player2: "NewbieToss", score1: 21, score2: 9, winner: "RingerChamp" },
  // Round 2 (Semifinals)
  { id: "m5", round: 2, position: 0, player1: "CornKing.sol", player2: "HoleInOne", score1: 21, score2: 18, winner: "CornKing.sol" },
  { id: "m6", round: 2, position: 1, player1: "GoldenArm", player2: "RingerChamp", score1: 15, score2: 21, winner: "RingerChamp" },
  // Round 3 (Final)
  { id: "m7", round: 3, position: 0, player1: "CornKing.sol", player2: "RingerChamp", score1: null, score2: null, winner: null },
];

const tournamentInfo = {
  name: "Corn Classic Weekly",
  format: "Single Elimination",
  buyIn: 100,
  prizePool: 5000,
  status: "active",
  prizeDistribution: [
    { place: "1st", amount: 2500, percent: "50%" },
    { place: "2nd", amount: 1250, percent: "25%" },
    { place: "3rd-4th", amount: 625, percent: "12.5%" },
  ],
};

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="text-xs text-corn-gold bg-corn-gold/10 px-3 py-1 rounded-full border border-corn-gold/30 mb-3 inline-block">
          {tournamentInfo.status.toUpperCase()}
        </span>
        <h1 className="text-4xl font-bold text-white mb-2">
          {tournamentInfo.name}
        </h1>
        <p className="text-gray-400">
          {tournamentInfo.format} | Buy-in: {tournamentInfo.buyIn} $CORN
        </p>
      </motion.div>

      {/* Prize Pool Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card max-w-2xl mx-auto mb-10"
      >
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Prize Pool:{" "}
          <span className="text-corn-gold">
            {tournamentInfo.prizePool.toLocaleString()} $CORN
          </span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {tournamentInfo.prizeDistribution.map((prize) => (
            <div
              key={prize.place}
              className="text-center p-3 bg-[#0a0a0f] rounded-lg"
            >
              <div className="text-sm text-gray-400">{prize.place}</div>
              <div className="text-lg font-bold text-corn-gold">
                {prize.amount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{prize.percent}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bracket */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Bracket
        </h2>
        <TournamentBracket matches={mockBracketData} />
      </motion.div>
    </div>
  );
}
