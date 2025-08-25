"use client";

import { useMenuStore } from "@/states/menu";
import { useShopStore } from "@/states/shop";
import { FiMenu } from "react-icons/fi";

export default function Navigation() {
  const { menuOpen, setMenuOpen } = useMenuStore();
  const { shopOpen, setShopOpen } = useShopStore();

  return (
    <nav className="fixed right-4 top-4 z-50 flex gap-3">
      {/* Buy button */}
      <button
        onClick={() => setShopOpen(true)}
        className="grid h-[46px] w-[46px] place-items-center rounded-full bg-black text-white"
      >
        <span className="text-sm font-medium">Buy</span>
      </button>

      {/* Menu button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="grid h-[46px] w-[46px] place-items-center rounded-full bg-black text-white"
      >
        <FiMenu className="h-5 w-5" />
      </button>
    </nav>
  );
}
