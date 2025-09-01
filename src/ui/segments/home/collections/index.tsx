"use client";

import type { typeface } from "@/types/typefaces";
import CollectionCard from "@/ui/segments/home/collections/collection-card";
import HeroHeader from "@/ui/segments/home/hero/hero-header";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type CollectionsListProp = {
  typefaces: typeface[];
};

type HoverPayload =
  | { hovering: false }
  | { hovering: true; cardRect: DOMRect; nameRect: DOMRect };

export default function CollectionsList({ typefaces }: CollectionsListProp) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHeroHeader, setShowHeroHeader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // --- cursor/highlighter state
  const [locked, setLocked] = useState(false);
  const [cursor, setCursor] = useState({ x: -9999, y: -9999, w: 0, h: 0 });
  const defaultSizePxRef = useRef(0);

  // compute 14vw in px on load/resize
  useEffect(() => {
    const calc = () => {
      const vw =
        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) *
        0.14;
      defaultSizePxRef.current = vw;
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // follow mouse when not locked
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (locked) return;

      const hostRect = containerRef.current?.getBoundingClientRect();
      if (!hostRect) return;

      const left = hostRect.left;
      const top = hostRect.top;
      const right = hostRect.right;
      const bottom = hostRect.bottom;

      // Check if mouse is inside the CollectionList boundaries
      const isInside =
        e.clientX >= left &&
        e.clientX <= right &&
        e.clientY >= top &&
        e.clientY <= bottom;

      if (!isInside) {
        // Hide cursor when outside CollectionList
        setCursor({ x: -9999, y: -9999, w: 0, h: 0 });
        return;
      }

      const size = defaultSizePxRef.current || 0;
      setCursor({
        w: size,
        h: size,
        x: e.clientX - left - size / 2,
        y: e.clientY - top - size / 2,
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [locked]);

  // card → parent hover callback

  const handleHoverFromCard = (payload: HoverPayload) => {
    const hostRect = containerRef.current?.getBoundingClientRect();
    const left = hostRect?.left ?? 0;
    const top = hostRect?.top ?? 0;

    if (!payload.hovering) {
      setLocked(false);
      const size = defaultSizePxRef.current || 0;
      setCursor((c) => ({ ...c, w: size, h: size }));
      return;
    }

    const PAD_X = 0; // optional horizontal padding
    const PAD_Y = 0; // optional vertical padding

    const { cardRect, nameRect } = payload;

    setLocked(true);
    setCursor({
      // FULL width of card, height of name
      w: Math.max(1, cardRect.width + PAD_X * 2),
      h: Math.max(1, cardRect.height + PAD_Y * 2),

      // X from card left, Y from name top (so it hugs the text row)
      x: cardRect.left - left - PAD_X,
      y: cardRect.top - top - PAD_Y + 15,
    });
  };

  // your existing scroll/width logic
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
        style={{ width: containerWidth }}
      >
        <div className="relative z-10 bg-black px-8 py-20 min-h-screen">
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
            <HeroHeader showContent />
          </motion.div>

          <motion.div
            id="collections-list-content"
            className="mt-12 gap-y-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: showContent ? 0 : 100, opacity: showContent ? 1 : 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3,
            }}
          >
            {typefaces.map((typeface: typeface, index: number) => (
              <CollectionCard
                key={typeface.slug}
                typeface={typeface}
                index={index}
                showContent={showContent}
                setMouseHoverCard={() => {}} // keep if you still need it elsewhere
                // NEW: pass the rect callback
                setMouseHoverCardRect={handleHoverFromCard}
              />
            ))}
          </motion.div>
        </div>

        {/* Floating highlighter */}
        <motion.div
          id="highlighter-bloc"
          className="pointer-events-none absolute z-50 -top-4 rounded-[120px] bg-white mix-blend-difference"
          style={{
            width: cursor.w,
            height: cursor.h,
            translateX: cursor.x,
            translateY: cursor.y,
            transition:
              "width 220ms cubic-bezier(.2,.8,.2,1), height 220ms cubic-bezier(.2,.8,.2,1), transform 220ms cubic-bezier(.2,.8,.2,1)",
          }}
        />
      </motion.div>
    </section>
  );
}
