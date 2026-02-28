import { create } from "zustand";

interface PartnerState {
  tokenEnabled: boolean | null;
  setTokenEnabled: (value: boolean | null) => void;
}

const usePartnerStore = create<PartnerState>((set) => ({
  tokenEnabled: null,
  setTokenEnabled: (value) => set({ tokenEnabled: value }),
}));

export default usePartnerStore;
