"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PlaygroundHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  // Transform scroll progress to text slide-in animation
  const normalizeSlide = useTransform(
    scrollYProgress,
    [0.8, 1.0],
    ["100%", "0%"]
  );
  const fontSpiritSlide = useTransform(
    scrollYProgress,
    [0.8, 1.0],
    ["100%", "0%"]
  );

  // Debug: log scroll progress
  console.log("Scroll progress:", scrollYProgress);

  return (
    <div ref={headerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left text-neutral-500 text-sm border-y border-solid border-neutral-200 py-4 font-sans">
        <div>
          <p>Typeface: Fuzar</p>
          <p>Designer: Your Name</p>
        </div>
        <div>
          <p>Release: 2025</p>
          <p>License: Desktop / Web / App</p>
        </div>
        <div>
          <p>Languages: Latin, Extended</p>
          <p>Features: Stylistic sets, ligatures</p>
        </div>
      </div>
      <h2
        className="text-[16vw] font-fuzar font-black leading-[1] mt-2"
        style={{ fontVariationSettings: "'wght' 900, 'wdth' 900" }}
      >
        <div className="overflow-hidden">Normalize</div>
        <div className="overflow-hidden">Font Spirit</div>
      </h2>
    </div>
  );
}
