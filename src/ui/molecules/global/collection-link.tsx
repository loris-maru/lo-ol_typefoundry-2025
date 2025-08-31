"use client";

import { useMenuStore } from "@/states/menu";
import Link from "next/link";
import { useState } from "react";

export default function CollectionLink({
  link,
  label,
  category,
  fontsNumber,
}: {
  link: string;
  label: string;
  category: string;
  fontsNumber: number;
}) {
  const [mouseHover, setMouseHover] = useState<boolean>(false);
  const { setMenuOpen } = useMenuStore();

  const handleClick = () => {
    setMenuOpen(false);
  };

  return (
    <Link
      href={link}
      onClick={handleClick}
      className="relative z-50 w-full flex flex-row justify-between items-baseline font-whisper hover:text-gray-300 cursor-pointer transition-all duration-300 mix-blend-difference"
      onMouseOver={() => setMouseHover(true)}
      onFocus={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
      onBlur={() => setMouseHover(false)}
    >
      <div
        className="text-2xl text-white font-whisper"
        style={{ fontVariationSettings: `'wght' ${mouseHover ? 700 : 300}` }}
      >
        {label}
      </div>
      <div className="flex flex-row gap-x-3 text-base text-neutral-400">
        <div>{category}</div>
        <div className="mx-2">|</div>
        <div>{fontsNumber} fonts</div>
      </div>
    </Link>
  );
}
