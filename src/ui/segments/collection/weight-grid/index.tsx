"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import SingleWeightCard from "./weight-card";

type WeightDef = { name: string; value: number; abbr: string };

const WEIGHTS: WeightDef[] = [
  { name: "Thin", value: 100, abbr: "Th" },
  { name: "ExtraLight", value: 200, abbr: "EL" },
  { name: "Light", value: 300, abbr: "Li" },
  { name: "Regular", value: 400, abbr: "Re" },
  { name: "Medium", value: 500, abbr: "Me" },
  { name: "Semibold", value: 600, abbr: "Se" },
  { name: "Bold", value: 700, abbr: "Bo" },
  { name: "ExtraBold", value: 800, abbr: "EB" },
  { name: "Black", value: 900, abbr: "Bl" },
];

export default function WeightsGridPanel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [wdthUI, setWdthUI] = useState<Record<number, number>>(() =>
    Object.fromEntries(WEIGHTS.map((_, i) => [i, 100]))
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to card scale (0 to 1 at 80% scroll)
  const cardScale = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen bg-[#F5F5F5] overflow-hidden"
    >
      {/* Background "Weights" title - fixed and centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          className="text-black font-black tracking-tight text-center"
          style={{ fontSize: "min(35vw, 40vh)" }}
        >
          Weights
        </h1>
      </div>

      {/* Simple 3x3 CSS Grid layout */}
      <div className="relative z-10 w-full h-full grid grid-cols-3 grid-rows-3 gap-[2px] p-0">
        {Array.from({ length: 9 }, (_, idx) => {
          return (
            <SingleWeightCard
              key={idx}
              weight={WEIGHTS[idx]}
              wdth={wdthUI[idx] ?? 900}
              onWdthChange={(val: number) =>
                setWdthUI((s) => ({ ...s, [idx]: val }))
              }
              isHovered={hovered}
              onHover={(isHovered: boolean) =>
                setHovered(isHovered ? idx : null)
              }
              index={idx}
            />
          );
        })}
      </div>

      <style jsx global>{`
        .slider-wdth-white {
          --thumb-size: 14px;
          --track-height: 2px;
          --track-bg: #ffffff;
          --thumb-bg: #000000;
        }
        .slider-wdth-white::-webkit-slider-runnable-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth-white::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: 2px solid #ffffff;
          cursor: pointer;
        }
        .slider-wdth-white::-moz-range-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth-white::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: 2px solid #ffffff;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
