"use client";

import { typeface } from "@/types/typefaces";
import CartButton from "@/ui/segments/global/navigation/cart-button";
import MenuButton from "@/ui/segments/global/navigation/menu-button";
import ShopButton from "@/ui/segments/global/navigation/shop-button";

export default function Navigation({
  content,
  allTypefaces,
}: {
  content: typeface;
  allTypefaces: typeface[];
}) {
  return (
    <>
      <ShopButton content={content} />
      <CartButton />
      <MenuButton allTypefaces={allTypefaces} />
    </>
  );
}
