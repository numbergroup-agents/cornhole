"use client";

type CosmeticType = "Bag" | "Board" | "Trail" | "Avatar";
type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

interface Cosmetic {
  id: string;
  name: string;
  type: CosmeticType;
  rarity: Rarity;
  imageUrl: string;
  equipped: boolean;
}

interface CosmeticCardProps {
  cosmetic: Cosmetic;
  onEquip: (id: string) => void;
  showPrice?: boolean;
  price?: number;
  seller?: string;
}

const rarityBorderColors: Record<Rarity, string> = {
  Common: "border-gray-500",
  Rare: "border-blue-500",
  Epic: "border-purple-500",
  Legendary: "border-orange-500",
  Mythic: "border-red-500",
};

const rarityBgColors: Record<Rarity, string> = {
  Common: "from-gray-500/10",
  Rare: "from-blue-500/10",
  Epic: "from-purple-500/10",
  Legendary: "from-orange-500/10",
  Mythic: "from-red-500/10",
};

const rarityTextColors: Record<Rarity, string> = {
  Common: "text-gray-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-400",
};

const typeIcons: Record<CosmeticType, string> = {
  Bag: "🎒",
  Board: "🪵",
  Trail: "✨",
  Avatar: "👤",
};

export function CosmeticCard({
  cosmetic,
  onEquip,
  showPrice = false,
  price,
  seller,
}: CosmeticCardProps) {
  return (
    <div
      className={`bg-[#1a1a2e] rounded-xl border-2 ${
        rarityBorderColors[cosmetic.rarity]
      } overflow-hidden transition-all hover:scale-[1.02]`}
    >
      {/* Image / Placeholder */}
      <div
        className={`aspect-square bg-gradient-to-b ${
          rarityBgColors[cosmetic.rarity]
        } to-transparent flex items-center justify-center`}
      >
        <span className="text-5xl opacity-60">
          {typeIcons[cosmetic.type]}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-white truncate">
          {cosmetic.name}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{cosmetic.type}</span>
          <span
            className={`text-xs font-semibold ${
              rarityTextColors[cosmetic.rarity]
            }`}
          >
            {cosmetic.rarity}
          </span>
        </div>

        {/* Price display for marketplace */}
        {showPrice && price !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-corn-gold text-sm font-bold">
                {price.toLocaleString()} $CORN
              </span>
            </div>
            {seller && (
              <p className="text-xs text-gray-600 mt-0.5 truncate">
                by {seller}
              </p>
            )}
            <button className="w-full mt-2 py-1.5 bg-corn-gold text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors">
              Buy Now
            </button>
          </div>
        )}

        {/* Equip button (non-marketplace view) */}
        {!showPrice && (
          <button
            onClick={() => onEquip(cosmetic.id)}
            className={`w-full mt-2 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              cosmetic.equipped
                ? "bg-corn-green/20 text-corn-green border border-corn-green/30"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {cosmetic.equipped ? "Equipped" : "Equip"}
          </button>
        )}
      </div>
    </div>
  );
}
