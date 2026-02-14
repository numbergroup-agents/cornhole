"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "1v1 Matches",
    description:
      "Challenge players in real-time skill-based matches. Wager $CORN tokens with commit-reveal throw mechanics.",
    icon: "🎯",
  },
  {
    title: "Tournaments",
    description:
      "Enter bracket-style tournaments with growing prize pools. Single and double elimination formats.",
    icon: "🏆",
  },
  {
    title: "NFT Cosmetics",
    description:
      "Customize your bags, boards, trails, and avatars with collectible NFTs. Flex your rarest gear.",
    icon: "🎨",
  },
  {
    title: "Staking",
    description:
      "Stake $CORN tokens to earn passive rewards. Lock for longer periods for boosted APY.",
    icon: "🌾",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-corn-gold/5 via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center z-10"
        >
          <div className="text-6xl mb-6 animate-float">🌽</div>
          <h1 className="text-6xl md:text-8xl font-bold gradient-text glow-gold mb-6 tracking-tight">
            CORNHOLE
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-4">
            On-chain skill-based tossing. Compete for{" "}
            <span className="text-corn-gold font-semibold">$CORN</span>.
          </p>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto">
            Aim, throw, and earn. Real physics. Real stakes. Real competition on
            Solana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4"
              >
                Play Now
              </motion.button>
            </Link>
            <Link href="/tournaments">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-10 py-4"
              >
                View Tournaments
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 text-white"
        >
          How It Works
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="card text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Banner */}
      <section className="border-y border-gray-800 bg-[#12121a] py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Total Matches", value: "---" },
            { label: "Active Players", value: "---" },
            { label: "$CORN Wagered", value: "---" },
            { label: "Tournaments Held", value: "---" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-corn-gold">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Toss?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Connect your Solana wallet and start competing. Practice mode
            available for free.
          </p>
          <Link href="/play">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-12 py-4"
            >
              Enter the Arena
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
