"use client";

import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { StakingPanel } from "@/components/StakingPanel";

export default function StakingPage() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Stake $CORN</h1>
        <p className="text-gray-400">
          Lock your tokens to earn passive rewards
        </p>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card text-center"
        >
          <div className="text-sm text-gray-500 mb-1">Total Value Locked</div>
          <div className="text-2xl font-bold text-corn-gold">
            2,450,000 $CORN
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="text-sm text-gray-500 mb-1">Current APY</div>
          <div className="text-2xl font-bold text-corn-green">12.5%</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card text-center"
        >
          <div className="text-sm text-gray-500 mb-1">Total Stakers</div>
          <div className="text-2xl font-bold text-white">1,284</div>
        </motion.div>
      </div>

      {/* APY Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-8"
      >
        <h3 className="text-lg font-bold text-white mb-4">
          Reward Rate by Lock Period
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { days: 7, apy: "5%", multiplier: "1x" },
            { days: 30, apy: "10%", multiplier: "1.5x" },
            { days: 90, apy: "15%", multiplier: "2x" },
            { days: 180, apy: "25%", multiplier: "3x" },
          ].map((tier) => (
            <div
              key={tier.days}
              className="bg-[#0a0a0f] rounded-lg p-4 text-center"
            >
              <div className="text-sm text-gray-400 mb-1">
                {tier.days} Days
              </div>
              <div className="text-xl font-bold text-corn-gold">{tier.apy}</div>
              <div className="text-xs text-gray-500">
                {tier.multiplier} rewards
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Staking Panel */}
      {connected ? (
        <StakingPanel />
      ) : (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🌾</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-400">
            Connect your Solana wallet to start staking $CORN tokens
          </p>
        </div>
      )}
    </div>
  );
}
