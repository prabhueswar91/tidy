import { create } from "zustand";

interface AppState {
  selectedTier: string | null;
  amount: number | null;
  setSelectedTier: (tier: string, amount: number | null) => void;

  walletAddress: string | null;
  setWalletAddress: (addr: string | null) => void;

  telegramId: string | null;
  setTelegramId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedTier: null,
  amount: null,
  setSelectedTier: (tier, amount) => set({ selectedTier: tier, amount }),

  walletAddress: null,
  setWalletAddress: (addr) => set({ walletAddress: addr }),

  telegramId: null,
  setTelegramId: (id) => set({ telegramId: id }),
}));
