"use client";

import { typeface } from "@/types/typefaces";
import MenuButton from "./menu-button";
import ShopButton from "./shop-button";

export default function Navigation({ content }: { content: typeface }) {
  return (
    <>
      <ShopButton content={content} />
      <MenuButton />
    </>
  );
}
