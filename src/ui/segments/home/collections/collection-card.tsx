// CollectionCard.tsx
'use client';

import type { typeface } from '@/types/typefaces';
import slugify from '@/utils/slugify';
import { useFont } from '@react-hooks-library/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

type HoverPayload = { hovering: false } | { hovering: true; cardRect: DOMRect; nameRect: DOMRect };

export default function CollectionCard({
  typeface,
  index,
  showContent,
  setMouseHoverCard,
  setMouseHoverCardRect, // NEW
}: {
  typeface: typeface;
  index: number;
  showContent: boolean;
  setMouseHoverCard: (isMouseHover: boolean) => void;
  setMouseHoverCardRect: (p: HoverPayload) => void;
}) {
  const [isMouseHover, setIsMouseHover] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null); // NEW
  const nameRef = useRef<HTMLHeadingElement | null>(null); // NEW

  const fontFamily = slugify(typeface.name);
  const { loaded, error } = useFont(fontFamily, typeface.varFont);
  if (error) return <div>Error loading font</div>;
  if (!loaded) return <div>Loading font</div>;

  const handleEnter = () => {
    setIsMouseHover(true);
    setMouseHoverCard(true);
    if (cardRef.current && nameRef.current) {
      setMouseHoverCardRect({
        hovering: true,
        cardRect: cardRef.current.getBoundingClientRect(),
        nameRect: nameRef.current.getBoundingClientRect(),
      });
    }
  };

  const handleLeave = () => {
    setIsMouseHover(false);
    setMouseHoverCard(false);
    setMouseHoverCardRect({ hovering: false });
  };

  return (
    <motion.div
      ref={cardRef} // <-- measure full card
      className="relative"
      key={typeface.slug}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: showContent ? 0 : 50, opacity: showContent ? 1 : 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3 + index * 0.15,
      }}
    >
      <Link
        href={`/collection/${typeface.slug}`}
        aria-label={typeface.name}
        className="relative z-10 flex items-center justify-between text-white"
      >
        {/* Name = hover trigger; we measure its height */}
        <h3
          ref={nameRef}
          className="text-[7vw] whitespace-nowrap transition-all duration-500 ease-in-out"
          style={{
            fontFamily,
            fontVariationSettings: `'wght' ${isMouseHover ? 900 : 400}, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
            paddingLeft: isMouseHover ? '72px' : 0,
          }}
        >
          {typeface.name}
        </h3>

        <div
          className="relative transition-all duration-300 ease-in-out"
          style={{
            paddingRight: isMouseHover ? '60px' : 0,
            opacity: isMouseHover ? 1 : 0,
          }}
        >
          <div className="font-whisper w-[16vw] divide-y divide-white rounded-r-full border border-solid border-white text-base font-normal transition-all duration-500 ease-in-out">
            <div className="mb-1 px-3 py-2">{typeface.singleFontList.length} fonts</div>
            <div className="px-3 py-2">{typeface.category}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
