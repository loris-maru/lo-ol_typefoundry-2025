"use client";

import { CartItem } from "@/lib/cart";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (fontId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find(
          (i) =>
            i.fontId === item.fontId &&
            i.licenseType === item.licenseType &&
            i.userTier === item.userTier,
        );
        if (exists) {
          set({
            items: get().items.map((i) =>
              i === exists ? { ...i, qty: (i.qty ?? 1) + (item.qty ?? 1) } : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (fontId) => set({ items: get().items.filter((i) => i.fontId !== fontId) }),
      clearCart: () => set({ items: [] }),
    }),
    { name: "lool-cart" },
  ),
);
