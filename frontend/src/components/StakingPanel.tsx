"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const lockPeriods = [
  { days: 7, label: "7 Days", apy: 5 },
  { days: 30, label: "30 Days", apy: 10 },
  { days: 90, label: "90 Days", apy: 15 },
  { days: 180, label: "180 Days", apy: 25 },
];

// Mock data for current staking position
const mockPosition = {
  stakedAmount: 5000,
  lockPeriod: 30,
  lockExpiry: "2026-03-07",
  pendingRewards: 125.5,
  startDate: "2026-02-05",
};

export function StakingPanel() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(lockPeriods[1]);
  const [isStaking, setIsStaking] = useState(false);

  const estimatedReward =
    stakeAmount && !isNaN(Number(stakeAmount))
      ? (
          (Number(stakeAmount) * selectedPeriod.apy * selectedPeriod.days) /
          (365 * 100)
        ).toFixed(2)
      : "0.00";

  const handleStake = async () => {
    if (!stakeAmount || Number(stakeAmount) <= 0) return;
    setIsStaking(true);
    // Placeholder: would call on-chain staking transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsStaking(false);
    setStakeAmount("");
  };

  const handleUnstake = async () => {
    // Placeholder: would call on-chain unstake transaction
  };

  const handleClaimRewards = async () => {
    // Placeholder: would call on-chain claim transaction
  };

  return (
    <div className="space-y-6">
      {/* Current Position */}
      {mockPosition.stakedAmount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Your Staking Position
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Staked</div>
              <div className="text-lg font-bold text-corn-gold">
                {mockPosition.stakedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">$CORN</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Lock Period</div>
              <div className="text-lg font-bold text-white">
                {mockPosition.lockPeriod}d
              </div>
              <div className="text-xs text-gray-600">
                Expires {mockPosition.lockExpiry}
              </div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Pending Rewards</div>
              <div className="text-lg font-bold text-corn-green">
                {mockPosition.pendingRewards.toFixed(2)}
              </div>
              <div className="text-xs text-gray-600">$CORN</div>
            </div>
            <div className="bg-[#0a0a0f] rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">APY</div>
              <div className="text-lg font-bold text-corn-green">
                {lockPeriods.find((p) => p.days === mockPosition.lockPeriod)
                  ?.apy || 10}
                %
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleUnstake} className="btn-danger flex-1">
              Unstake
            </button>
            <button onClick={handleClaimRewards} className="btn-primary flex-1">
              Claim Rewards ({mockPosition.pendingRewards.toFixed(2)} $CORN)
            </button>
          </div>
        </motion.div>
      )}

      {/* Stake Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-white mb-4">Stake $CORN</h3>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-1 block">Amount</label>
          <div className="relative">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount to stake"
              className="input-field w-full pr-20"
              min="0"
            />
            <button
              onClick={() => setStakeAmount("10000")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-corn-gold hover:text-yellow-400 font-medium"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Lock Period Selection */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">
            Lock Period
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {lockPeriods.map((period) => (
              <button
                key={period.days}
                onClick={() => setSelectedPeriod(period)}
                className={`p-3 rounded-lg text-center transition-all border ${
                  selectedPeriod.days === period.days
                    ? "border-corn-gold bg-corn-gold/10 text-white"
                    : "border-gray-700 bg-[#0a0a0f] text-gray-400 hover:border-gray-500"
                }`}
              >
                <div className="text-sm font-medium">{period.label}</div>
                <div className="text-xs text-corn-green mt-1">
                  {period.apy}% APY
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Rewards */}
        <div className="bg-[#0a0a0f] rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Estimated APY</span>
            <span className="text-corn-green font-bold">
              {selectedPeriod.apy}%
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">Estimated Reward</span>
            <span className="text-corn-gold font-bold">
              {estimatedReward} $CORN
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">Lock Until</span>
            <span className="text-white text-sm">
              {new Date(
                Date.now() + selectedPeriod.days * 86400000
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stake Button */}
        <button
          onClick={handleStake}
          disabled={!stakeAmount || Number(stakeAmount) <= 0 || isStaking}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStaking ? "Staking..." : "Stake $CORN"}
        </button>
      </motion.div>
    </div>
  );
}
