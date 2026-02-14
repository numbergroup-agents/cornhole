import { create } from "zustand";
import { WindState } from "@/game/physics/wind";

export type MatchStatus = "waiting" | "active" | "completed" | "cancelled";
export type GameMode = "casual" | "ranked" | "high-roller" | "practice";

export interface Player {
  wallet: string;
  username: string;
}

export interface ThrowRecord {
  player: string;
  round: number;
  throwIndex: number;
  angle: number;
  power: number;
  result: "miss" | "board" | "hole";
  points: number;
}

interface GameState {
  matchId: string | null;
  players: Player[];
  scores: number[];
  currentRound: number;
  currentThrow: number;
  status: MatchStatus;
  throws: ThrowRecord[];
  wind: WindState;
  myTurn: boolean;
  mode: GameMode;
  wager: number;
}

interface GameActions {
  setMatch: (data: {
    matchId: string;
    players: Player[];
    mode: GameMode;
    wager: number;
  }) => void;
  updateScores: (scores: number[]) => void;
  addThrow: (throwRecord: ThrowRecord) => void;
  nextRound: () => void;
  setMyTurn: (isMyTurn: boolean) => void;
  setWind: (wind: WindState) => void;
  endMatch: (finalScores: number[]) => void;
  reset: () => void;
}

const initialState: GameState = {
  matchId: null,
  players: [],
  scores: [0, 0],
  currentRound: 1,
  currentThrow: 0,
  status: "waiting",
  throws: [],
  wind: { speed: 0, direction: 0 },
  myTurn: true,
  mode: "casual",
  wager: 0,
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,

  setMatch: (data) =>
    set({
      matchId: data.matchId,
      players: data.players,
      mode: data.mode,
      wager: data.wager,
      status: "active",
      scores: [0, 0],
      currentRound: 1,
      currentThrow: 0,
      throws: [],
      myTurn: true,
    }),

  updateScores: (scores) => set({ scores }),

  addThrow: (throwRecord) =>
    set((state) => ({
      throws: [...state.throws, throwRecord],
      currentThrow: state.currentThrow + 1,
    })),

  nextRound: () =>
    set((state) => ({
      currentRound: state.currentRound + 1,
      currentThrow: 0,
    })),

  setMyTurn: (isMyTurn) => set({ myTurn: isMyTurn }),

  setWind: (wind) => set({ wind }),

  endMatch: (finalScores) =>
    set({
      status: "completed",
      scores: finalScores,
    }),

  reset: () => set(initialState),
}));
