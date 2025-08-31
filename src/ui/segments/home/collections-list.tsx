"use client";

import { useMenuStore } from "@/states/menu";
import { typeface } from "@/types/typefaces";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

interface CollectionsListProps {
  typefaces: typeface[];
}

export default function CollectionsList({ typefaces }: CollectionsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { setMenuOpen } = useMenuStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const containerWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["40vw", "100vw"]
  );

  const handleCollectionClick = () => {
    setMenuOpen(false);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-white"
    >
      <motion.div
        className="relative mx-auto"
        style={{
          width: containerWidth,
        }}
      >
        {/* Black background container */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{
            height: hoveredIndex !== null ? "100%" : "2px",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Collections list */}
        <div className="relative z-10 py-20 px-8">
          <div className="space-y-8">
            {typefaces.map((typeface, index) => (
              <motion.div
                key={typeface.slug}
                className="group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={`/collection/${typeface.slug}`}
                  onClick={handleCollectionClick}
                  className="block"
                >
                  <div className="flex justify-between items-baseline text-white">
                    {/* Collection name */}
                    <motion.h3
                      className="text-4xl md:text-5xl font-light font-whisper group-hover:text-gray-200 transition-colors duration-300"
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {typeface.name}
                    </motion.h3>

                    {/* Font count and axis info */}
                    <div className="text-right text-lg font-light opacity-80">
                      <div className="mb-1">
                        {typeface.singleFontList.length} fonts
                      </div>
                      <div className="text-sm opacity-70">
                        {typeface.axisNames?.map((axisName, axisIndex) => (
                          <span key={axisName}>
                            {axisName}
                            {axisIndex < (typeface.axisNames?.length || 0) - 1
                              ? ", "
                              : ""}
                          </span>
                        )) || "Standard"}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
