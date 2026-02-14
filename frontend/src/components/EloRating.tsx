"use client";

interface EloRatingProps {
  elo: number;
  tier: string;
}

const tierConfig: Record<
  string,
  { color: string; bgColor: string; borderColor: string; nextThreshold: number }
> = {
  Rookie: {
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400",
    nextThreshold: 1200,
  },
  Tosser: {
    color: "text-corn-green",
    bgColor: "bg-green-400/10",
    borderColor: "border-corn-green",
    nextThreshold: 1500,
  },
  Ringer: {
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400",
    nextThreshold: 1800,
  },
  Champion: {
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400",
    nextThreshold: 2100,
  },
  Legend: {
    color: "text-corn-gold",
    bgColor: "bg-corn-gold/10",
    borderColor: "border-corn-gold",
    nextThreshold: 9999,
  },
};

const tierThresholds = [
  { name: "Rookie", min: 0 },
  { name: "Tosser", min: 1200 },
  { name: "Ringer", min: 1500 },
  { name: "Champion", min: 1800 },
  { name: "Legend", min: 2100 },
];

export function EloRating({ elo, tier }: EloRatingProps) {
  const config = tierConfig[tier] || tierConfig.Rookie;

  // Calculate progress to next tier
  const currentTierData = tierThresholds.find((t) => t.name === tier);
  const currentMin = currentTierData?.min || 0;
  const nextThreshold = config.nextThreshold;
  const range = nextThreshold - currentMin;
  const progress =
    tier === "Legend"
      ? 100
      : Math.min(((elo - currentMin) / range) * 100, 100);

  // Circle dimensions
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Circular badge */}
      <div className="relative w-28 h-28">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-800"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            className={config.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* ELO number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${config.color}`}>{elo}</span>
          <span className="text-[10px] text-gray-500">ELO</span>
        </div>
      </div>

      {/* Tier name */}
      <div className="mt-2">
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}/30`}
        >
          {tier}
        </span>
      </div>

      {/* Progress to next tier */}
      {tier !== "Legend" && (
        <div className="mt-2 text-center">
          <div className="w-24 bg-gray-800 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${config.bgColor.replace("/10", "")}`}
              style={{
                width: `${progress}%`,
                backgroundColor:
                  tier === "Rookie"
                    ? "#9ca3af"
                    : tier === "Tosser"
                    ? "#228B22"
                    : tier === "Ringer"
                    ? "#60a5fa"
                    : "#a855f7",
              }}
            />
          </div>
          <span className="text-[10px] text-gray-600 mt-0.5 block">
            {nextThreshold - elo} to next tier
          </span>
        </div>
      )}
    </div>
  );
}
