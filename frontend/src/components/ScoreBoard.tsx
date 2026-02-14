"use client";

interface PlayerInfo {
  name: string;
  score: number;
}

interface ScoreBoardProps {
  player1: PlayerInfo;
  player2: PlayerInfo;
  currentRound: number;
  bagsRemaining: number;
}

export function ScoreBoard({
  player1,
  player2,
  currentRound,
  bagsRemaining,
}: ScoreBoardProps) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl px-6 py-3 flex items-center justify-between">
        {/* Player 1 */}
        <div className="text-left flex-1">
          <div className="text-sm text-gray-400 truncate max-w-[120px]">
            {player1.name}
          </div>
          <div className="text-3xl font-bold text-corn-red">
            {player1.score}
          </div>
        </div>

        {/* Center - Round + Bags */}
        <div className="text-center px-4">
          <div className="text-xs text-gray-500 uppercase">Round</div>
          <div className="text-lg font-bold text-white">{currentRound}</div>
          <div className="flex gap-1 mt-1 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i < bagsRemaining ? "bg-corn-gold" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">
            bags left
          </div>
        </div>

        {/* Player 2 */}
        <div className="text-right flex-1">
          <div className="text-sm text-gray-400 truncate max-w-[120px] ml-auto">
            {player2.name}
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {player2.score}
          </div>
        </div>
      </div>
    </div>
  );
}
