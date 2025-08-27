"use client";

import { PACKAGES } from "@/app/content/PACKAGES";
import { typeface } from "@/types/typefaces";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import PackageCard from "./card";

export default function ShopPackages({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.75,
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-full flex bg-[#eaeaea] overflow-hidden px-[14vw] py-[16vh] gap-x-2"
    >
      {PACKAGES.map((pkg, idx) => (
        <PackageCard
          key={pkg.key}
          content={content}
          isInView={isInView}
          pkg={pkg}
          idx={idx}
          isHovered={hoveredIndex === idx}
          onHoverChange={(isHovered) => setHoveredIndex(isHovered ? idx : null)}
        />
      ))}
    </section>
  );
}
