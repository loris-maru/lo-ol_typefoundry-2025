"use client";

import { PACKAGES } from "@/app/content/PACKAGES";
import { typeface } from "@/types/typefaces";
import PackageCard from "@/ui/segments/collection/shop-package/card";
import { cn } from "@/utils/classNames";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ShopPackages({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [sectionTop, setSectionTop] = useState(0);
  const isInView = useInView(sectionRef, {
    amount: 0.75,
    once: false,
  });

  const videoUrl = content.headerVideo;

  // Handle scroll-based positioning
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrollY = window.scrollY;
        const rect = sectionRef.current.getBoundingClientRect();

        // If not fixed, check if we should become fixed
        if (!isFixed) {
          if (rect.top <= 0) {
            setIsFixed(true);
            // Store the original position of the section in the document
            setSectionTop(scrollY + rect.top);
          }
        } else {
          // If fixed, check if we should unfix by comparing scroll position
          if (scrollY < sectionTop) {
            setIsFixed(false);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFixed, sectionTop]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "bg-[#EFEFEF] overflow-hidden h-screen px-[14vw] py-[8vh] gap-x-2 flex flex-row",
        isFixed && "fixed top-0 left-0 w-full z-20"
      )}
    >
      {PACKAGES.map((pkg, idx) => (
        <PackageCard
          key={pkg.key}
          content={content}
          isInView={isInView}
          videoUrl={videoUrl}
          pkg={pkg}
          idx={idx}
          isHovered={hoveredIndex === idx}
          onHoverChange={(isHovered) => setHoveredIndex(isHovered ? idx : null)}
        />
      ))}
    </section>
  );
}
