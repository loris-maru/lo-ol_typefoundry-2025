"use client";

import { useRef } from "react";

import { motion, useScroll, useTransform } from "motion/react";

import { typeface } from "@/types/typefaces";
import CharacterSetPanel from "@/ui/segments/collection/character-set";
import FontInfoPanel from "@/ui/segments/collection/font-info";
import WeightGrid from "@/ui/segments/collection/weight-grid";

export default function CollectionHorizontal({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Panels: 1) Weights, 2) Character Set, 3) Font Info, 4) Spacer (pause)
  const PANELS = 4;
  const sectionHeight = `calc(${PANELS} * 100vh)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Horizontal translate across the first 3 panels only
  const x = useTransform(
    scrollYProgress,
    [0, 0.75], // Complete horizontal scroll by 75% of total scroll
    ["0vw", `-${(3 - 1) * 100}vw`],
  );

  return (
    <section ref={sectionRef} style={{ height: sectionHeight }} className="relative z-30">
      {/* Sticky viewport that stays fixed after horizontal scroll */}
      <div className="sticky top-0 h-[100vh] w-[100vw] overflow-hidden">
        {/* Background track (horizontal) */}
        <motion.div style={{ x }} className="flex h-full">
          {/* Panel 1: Weights Grid */}
          <div className="h-[100vh] w-[100vw] shrink-0 bg-white">
            <WeightGrid content={content} />
          </div>

          {/* Panel 2: Character Set */}
          <div className="grid h-[100vh] w-[100vw] shrink-0 place-items-center">
            <CharacterSetPanel content={content} />
          </div>

          {/* Panel 3: Font Info */}
          <div className="grid h-[100vh] w-[100vw] shrink-0 place-items-center bg-[#efefef]">
            <FontInfoPanel content={content} collectionColor={content.color} />
          </div>

          {/* Panel 4: Spacer (visual pause) */}
          <div className="h-[100vh] w-[100vw] shrink-0 bg-[#eaeaea]" />
        </motion.div>
      </div>
    </section>
  );
}
