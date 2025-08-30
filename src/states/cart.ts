import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SingleCartItem = {
  _key: string;
  fullName: string;
  license: string;
  users: [number, number];
  family: string;
  weightName: string;
  weightValue: number;
  widthName: string;
  widthValue: number;
  opticalSizeName: string;
  opticalSizeValue: number;
  slantName: string;
  slantValue: number;
  isItalic: boolean;
  hasSerif: boolean;
  serifStyleValue: number;
  has_MONO: boolean;
  monoStyleName: string;
  monoStyleValue: number;
  has_STEN: boolean;
  stencilStyleName: string;
  stencilStyleValue: number;
  price: number;
};

type CartState = {
  cart: SingleCartItem[];
  addToCart: (item: SingleCartItem) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (key) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._key !== key),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // unique name for localStorage key
      partialize: (state) => ({ cart: state.cart }), // only persist cart array
    }
  )
);
