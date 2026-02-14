"use client";

import { useState } from "react";
import { getWindDirectionLabel, WindState } from "@/game/physics/wind";

interface ThrowControlsProps {
  wind: WindState;
  onThrow: (angle: number, power: number) => void;
}

export function ThrowControls({ wind, onThrow }: ThrowControlsProps) {
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(90);

  const handleThrow = () => {
    onThrow(angle, power);
  };

  const windLabel = getWindDirectionLabel(wind.direction);

  return (
    <div className="max-w-xl mx-auto mt-4">
      <div className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-4">
        {/* Instructions */}
        <p className="text-xs text-gray-500 text-center mb-3">
          Click and drag on the game canvas to aim and throw. Or use controls
          below for mobile.
        </p>

        <div className="flex items-end gap-6">
          {/* Power Meter */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Power</span>
            <div className="relative w-8 h-32 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-corn-red via-corn-gold to-corn-green rounded-full transition-all"
                style={{ height: `${power}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              className="w-32 -rotate-90 origin-center mt-[-40px] mb-[-40px] opacity-0 cursor-pointer h-8"
              style={{ width: "128px" }}
            />
            <span className="text-sm text-white font-mono">{power}%</span>
          </div>

          {/* Angle Indicator */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs text-gray-500">Angle</span>
            <div className="relative w-24 h-12">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                {/* Arc background */}
                <path
                  d="M 5 45 A 45 45 0 0 1 95 45"
                  fill="none"
                  stroke="#333"
                  strokeWidth="3"
                />
                {/* Angle indicator line */}
                <line
                  x1="50"
                  y1="45"
                  x2={50 + Math.cos((angle * Math.PI) / 180) * 40}
                  y2={45 - Math.sin((angle * Math.PI) / 180) * 40}
                  stroke="#FFD700"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="45" r="3" fill="#FFD700" />
              </svg>
            </div>
            <input
              type="range"
              min="10"
              max="170"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-corn-gold"
            />
            <span className="text-sm text-white font-mono">{angle}deg</span>
          </div>

          {/* Wind Display */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Wind</span>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg">
              <svg viewBox="0 0 40 40" className="w-8 h-8">
                <line
                  x1="20"
                  y1="20"
                  x2={20 + Math.cos((wind.direction * Math.PI) / 180) * 14}
                  y2={20 + Math.sin((wind.direction * Math.PI) / 180) * 14}
                  stroke="#88aaff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="4"
                    refX="5"
                    refY="2"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 2, 0 4" fill="#88aaff" />
                  </marker>
                </defs>
              </svg>
            </div>
            <span className="text-xs text-blue-300 font-mono">
              {wind.speed.toFixed(1)} {windLabel}
            </span>
          </div>
        </div>

        {/* Throw Button (mobile) */}
        <button
          onClick={handleThrow}
          className="btn-primary w-full mt-4 md:hidden"
        >
          Throw!
        </button>
      </div>
    </div>
  );
}
