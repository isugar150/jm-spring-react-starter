import { create } from "zustand";

type ScrollEntry = {
  top: number;
};

type ScrollState = {
  positions: Record<string, ScrollEntry>;
  setPosition: (key: string, top: number) => void;
  getPosition: (key: string) => number;
  clearPosition: (key: string) => void;
  clearByPathPrefix: (pathPrefix: string) => void;
};

export const useScrollStore = create<ScrollState>((set, get) => ({
  positions: {},
  setPosition: (key, top) =>
    set((state) => ({
      positions: {
        ...state.positions,
        [key]: { top },
      },
    })),
  getPosition: (key) => get().positions[key]?.top ?? 0,
  clearPosition: (key) =>
    set((state) => {
      if (!state.positions[key]) return state;
      const next = { ...state.positions };
      delete next[key];
      return { positions: next };
    }),
  clearByPathPrefix: (pathPrefix) =>
    set((state) => {
      const entries = Object.entries(state.positions);
      const filtered = entries.filter(([key]) => !key.startsWith(pathPrefix));
      if (filtered.length === entries.length) return state;
      return { positions: Object.fromEntries(filtered) };
    }),
}));
