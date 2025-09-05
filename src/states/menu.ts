import { create } from "zustand";

type MenuState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  menuOpen: false,
  setMenuOpen: (open) => set({ menuOpen: open }),
}));
