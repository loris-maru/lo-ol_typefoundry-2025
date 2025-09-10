"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export default function Introduction({
  content,
  familyName,
}: {
  content: string;
  familyName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Split content into lines and limit to 4 lines
  const lines = content.split('\n').filter(line => line.trim() !== '').slice(0, 4);
  
  return (
    <div ref={containerRef} className="w-2/3">
      <div
        className="text-7xl leading-tight font-medium hyphens-auto text-left line-clamp-4"
        style={{
          fontFamily: familyName,
          fontVariationSettings: `'wght' 900, 'wdth' 900, 'slnt' 0, 'opsz' 900`,
        }}
      >
        {lines.map((line, index) => {
          // Each line has its own scroll-based animation
          const lineProgress = useTransform(
            scrollYProgress,
            [0, 0.2 + index * 0.1, 0.8 - index * 0.1, 1],
            [0, 1, 1, 0]
          );
          
          const y = useTransform(
            scrollYProgress,
            [0, 0.2 + index * 0.1, 0.8 - index * 0.1, 1],
            [50, 0, 0, -50]
          );

          return (
            <motion.div
              key={index}
              style={{
                opacity: lineProgress,
                y: y,
              }}
            >
              {line}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
