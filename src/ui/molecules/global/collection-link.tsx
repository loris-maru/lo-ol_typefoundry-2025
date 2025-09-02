'use client';

import { useMenuStore } from '@/states/menu';
import Link from 'next/link';
import { useState } from 'react';

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
      className="font-whisper relative z-50 flex w-full cursor-pointer flex-row items-baseline justify-between mix-blend-difference transition-all duration-300 hover:text-gray-300"
      onMouseOver={() => setMouseHover(true)}
      onFocus={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
      onBlur={() => setMouseHover(false)}
    >
      <div
        className="font-whisper text-2xl text-white"
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
