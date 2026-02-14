import { create } from "zustand";

export interface CosmeticItem {
  id: string;
  name: string;
  type: "Bag" | "Board" | "Trail" | "Avatar";
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
  imageUrl: string;
  equipped: boolean;
}

export interface EquippedCosmetics {
  bag: string | null;
  board: string | null;
  trail: string | null;
  avatar: string | null;
}

interface UserState {
  wallet: string | null;
  username: string;
  elo: number;
  tier: string;
  wins: number;
  losses: number;
  balance: number;
  cosmetics: CosmeticItem[];
  equippedCosmetics: EquippedCosmetics;
}

interface UserActions {
  setUser: (data: Partial<UserState>) => void;
  updateElo: (newElo: number, newTier: string) => void;
  updateBalance: (amount: number) => void;
  addWin: () => void;
  addLoss: () => void;
  equipCosmetic: (cosmeticId: string, type: keyof EquippedCosmetics) => void;
  unequipCosmetic: (type: keyof EquippedCosmetics) => void;
  addCosmetic: (cosmetic: CosmeticItem) => void;
}

const initialState: UserState = {
  wallet: null,
  username: "Anonymous",
  elo: 1000,
  tier: "Rookie",
  wins: 0,
  losses: 0,
  balance: 0,
  cosmetics: [],
  equippedCosmetics: {
    bag: null,
    board: null,
    trail: null,
    avatar: null,
  },
};

/**
 * Determines the tier name based on ELO rating.
 */
function getTierFromElo(elo: number): string {
  if (elo >= 2100) return "Legend";
  if (elo >= 1800) return "Champion";
  if (elo >= 1500) return "Ringer";
  if (elo >= 1200) return "Tosser";
  return "Rookie";
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,

  setUser: (data) => set((state) => ({ ...state, ...data })),

  updateElo: (newElo, newTier) =>
    set({
      elo: newElo,
      tier: newTier || getTierFromElo(newElo),
    }),

  updateBalance: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
    })),

  addWin: () =>
    set((state) => ({
      wins: state.wins + 1,
    })),

  addLoss: () =>
    set((state) => ({
      losses: state.losses + 1,
    })),

  equipCosmetic: (cosmeticId, type) =>
    set((state) => ({
      equippedCosmetics: {
        ...state.equippedCosmetics,
        [type]: cosmeticId,
      },
      cosmetics: state.cosmetics.map((c) =>
        c.id === cosmeticId
          ? { ...c, equipped: true }
          : c.type.toLowerCase() === type
          ? { ...c, equipped: false }
          : c
      ),
    })),

  unequipCosmetic: (type) =>
    set((state) => ({
      equippedCosmetics: {
        ...state.equippedCosmetics,
        [type]: null,
      },
      cosmetics: state.cosmetics.map((c) =>
        c.type.toLowerCase() === type ? { ...c, equipped: false } : c
      ),
    })),

  addCosmetic: (cosmetic) =>
    set((state) => ({
      cosmetics: [...state.cosmetics, cosmetic],
    })),
}));
