import { create } from "zustand";

type ShopState = {
  shopOpen: boolean;
  setShopOpen: (open: boolean) => void;
};

export const useShopStore = create<ShopState>((set) => ({
  shopOpen: false,
  setShopOpen: (open) => set({ shopOpen: open }),
}));
