"use client";

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

interface TournamentBracketProps {
  matches: BracketMatch[];
}

export function TournamentBracket({ matches }: TournamentBracketProps) {
  // Group matches by round
  const rounds = new Map<number, BracketMatch[]>();
  matches.forEach((match) => {
    const roundMatches = rounds.get(match.round) || [];
    roundMatches.push(match);
    rounds.set(match.round, roundMatches);
  });

  const sortedRoundKeys = Array.from(rounds.keys()).sort((a, b) => a - b);
  const maxRound = Math.max(...sortedRoundKeys);

  const roundLabels: Record<number, string> = {};
  sortedRoundKeys.forEach((round, index) => {
    if (round === maxRound) {
      roundLabels[round] = "Final";
    } else if (round === maxRound - 1) {
      roundLabels[round] = "Semifinals";
    } else if (round === maxRound - 2) {
      roundLabels[round] = "Quarterfinals";
    } else {
      roundLabels[round] = `Round ${round}`;
    }
  });

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-fit justify-center items-center">
        {sortedRoundKeys.map((roundNum) => {
          const roundMatches = rounds.get(roundNum) || [];
          const sortedMatches = [...roundMatches].sort(
            (a, b) => a.position - b.position
          );

          return (
            <div key={roundNum} className="flex flex-col items-center">
              {/* Round header */}
              <div className="text-sm text-gray-500 mb-4 font-medium">
                {roundLabels[roundNum] || `Round ${roundNum}`}
              </div>

              {/* Matches in this round */}
              <div className="flex flex-col gap-8 justify-center">
                {sortedMatches.map((match) => (
                  <BracketMatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BracketMatchCard({ match }: { match: BracketMatch }) {
  const p1Won = match.winner === match.player1;
  const p2Won = match.winner === match.player2;
  const isComplete = match.winner !== null;

  return (
    <div className="w-52 bg-[#1a1a2e] border border-gray-800 rounded-lg overflow-hidden">
      {/* Player 1 row */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 border-b border-gray-800 ${
          p1Won ? "bg-corn-green/10" : ""
        }`}
      >
        <span
          className={`text-sm truncate max-w-[140px] ${
            p1Won
              ? "text-corn-green font-semibold"
              : match.player1
              ? "text-white"
              : "text-gray-600 italic"
          }`}
        >
          {match.player1 || "TBD"}
        </span>
        <span
          className={`text-sm font-mono ${
            p1Won ? "text-corn-green font-bold" : "text-gray-400"
          }`}
        >
          {match.score1 !== null ? match.score1 : "-"}
        </span>
      </div>

      {/* Player 2 row */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 ${
          p2Won ? "bg-corn-green/10" : ""
        }`}
      >
        <span
          className={`text-sm truncate max-w-[140px] ${
            p2Won
              ? "text-corn-green font-semibold"
              : match.player2
              ? "text-white"
              : "text-gray-600 italic"
          }`}
        >
          {match.player2 || "TBD"}
        </span>
        <span
          className={`text-sm font-mono ${
            p2Won ? "text-corn-green font-bold" : "text-gray-400"
          }`}
        >
          {match.score2 !== null ? match.score2 : "-"}
        </span>
      </div>

      {/* Status indicator */}
      {!isComplete && match.player1 && match.player2 && (
        <div className="bg-corn-gold/10 text-corn-gold text-xs text-center py-1">
          In Progress
        </div>
      )}
    </div>
  );
}
