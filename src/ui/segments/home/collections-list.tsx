"use client";

import type { typeface } from "@/types/typefaces";
import CollectionCard from "@/ui/segments/home/blocs/CollectionCard";
import HeroHeader from "@/ui/segments/home/blocs/hero-header";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export type CollectionsListProp = {
  typefaces: typeface[];
};

export default function CollectionsList({ typefaces }: CollectionsListProp) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHeroHeader, setShowHeroHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const containerWidth = useTransform(
    scrollYProgress,
    [0, 1],
    ["40vw", "100vw"]
  );

  const heroHeaderProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(heroHeaderProgress, "change", (latest) => {
    setShowHeroHeader(latest >= 0.8);
    setShowContent(latest >= 1);
  });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen">
      <motion.div
        id="collections-list"
        className="relative mx-auto"
        style={{
          width: containerWidth,
        }}
      >
        {/* Collections list */}
        <div className="relative z-10 py-20 px-8 bg-black min-h-screen">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: showHeroHeader ? 0 : 100,
              opacity: showHeroHeader ? 1 : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.1,
            }}
          >
            <HeroHeader showContent={true} />
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: showContent ? 0 : 100,
              opacity: showContent ? 1 : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3,
            }}
            className="gap-y-6 mt-12"
            id="collections-list-content"
          >
            {typefaces.map((typeface: typeface, index: number) => (
              <CollectionCard
                typeface={typeface}
                key={typeface.slug}
                showContent={showContent}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
