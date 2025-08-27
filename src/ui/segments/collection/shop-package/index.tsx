"use client";

import { PACKAGES } from "@/app/content/PACKAGES";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import PackageCard from "./card";

export default function ShopPackages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.75,
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-full flex bg-[#eaeaea] overflow-hidden p-[14vw] gap-x-2"
    >
      {PACKAGES.map((pkg, idx) => (
        <PackageCard
          key={pkg.key}
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
