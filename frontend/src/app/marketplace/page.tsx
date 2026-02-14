"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CosmeticCard } from "@/components/CosmeticCard";

type CosmeticType = "Bag" | "Board" | "Trail" | "Avatar";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

interface MarketplaceItem {
  id: string;
  name: string;
  type: CosmeticType;
  rarity: Rarity;
  price: number;
  seller: string;
  imageUrl: string;
  equipped: boolean;
}

const mockItems: MarketplaceItem[] = [
  { id: "n1", name: "Golden Bag", type: "Bag", rarity: "Legendary", price: 2500, seller: "CornKing.sol", imageUrl: "", equipped: false },
  { id: "n2", name: "Neon Trail", type: "Trail", rarity: "Epic", price: 800, seller: "TossLord42", imageUrl: "", equipped: false },
  { id: "n3", name: "Rustic Board", type: "Board", rarity: "Common", price: 50, seller: "BagSlinger", imageUrl: "", equipped: false },
  { id: "n4", name: "Diamond Bag", type: "Bag", rarity: "Mythic", price: 10000, seller: "RingerChamp", imageUrl: "", equipped: false },
  { id: "n5", name: "Corn Field Board", type: "Board", rarity: "Rare", price: 300, seller: "GoldenArm", imageUrl: "", equipped: false },
  { id: "n6", name: "Robot Avatar", type: "Avatar", rarity: "Epic", price: 1200, seller: "CornFarmer", imageUrl: "", equipped: false },
  { id: "n7", name: "Fire Trail", type: "Trail", rarity: "Rare", price: 400, seller: "HoleInOne", imageUrl: "", equipped: false },
  { id: "n8", name: "Classic Bag", type: "Bag", rarity: "Common", price: 25, seller: "NewbieToss", imageUrl: "", equipped: false },
  { id: "n9", name: "Galaxy Board", type: "Board", rarity: "Legendary", price: 3500, seller: "CornKing.sol", imageUrl: "", equipped: false },
  { id: "n10", name: "Phantom Avatar", type: "Avatar", rarity: "Mythic", price: 15000, seller: "TossLord42", imageUrl: "", equipped: false },
  { id: "n11", name: "Rainbow Trail", type: "Trail", rarity: "Legendary", price: 2800, seller: "BagSlinger", imageUrl: "", equipped: false },
  { id: "n12", name: "Corn Husk Bag", type: "Bag", rarity: "Rare", price: 200, seller: "GoldenArm", imageUrl: "", equipped: false },
];

const typeFilters: (CosmeticType | "All")[] = ["All", "Bag", "Board", "Trail", "Avatar"];
const rarityFilters: (Rarity | "All")[] = ["All", "Common", "Rare", "Epic", "Legendary", "Mythic"];

export default function MarketplacePage() {
  const [typeFilter, setTypeFilter] = useState<CosmeticType | "All">("All");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "All">("All");

  const filtered = mockItems.filter((item) => {
    if (typeFilter !== "All" && item.type !== typeFilter) return false;
    if (rarityFilter !== "All" && item.rarity !== rarityFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
        <p className="text-gray-400">
          Buy and sell cosmetic NFTs to customize your game
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Type Filter */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Type</label>
          <div className="flex gap-1 flex-wrap">
            {typeFilters.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  typeFilter === type
                    ? "bg-corn-gold text-black"
                    : "bg-[#1a1a2e] text-gray-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Rarity</label>
          <div className="flex gap-1 flex-wrap">
            {rarityFilters.map((rarity) => (
              <button
                key={rarity}
                onClick={() => setRarityFilter(rarity)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rarityFilter === rarity
                    ? "bg-corn-gold text-black"
                    : "bg-[#1a1a2e] text-gray-400 hover:text-white"
                }`}
              >
                {rarity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <CosmeticCard
              cosmetic={item}
              onEquip={() => {}}
              showPrice={true}
              price={item.price}
              seller={item.seller}
            />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          No items found with the selected filters.
        </div>
      )}
    </div>
  );
}
