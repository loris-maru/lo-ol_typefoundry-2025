"use client";

import { useRef, useEffect, useState } from "react";

import { useMotionValue } from "motion/react";

import { typeface } from "@/types/typefaces";
import StoryContent from "@/ui/segments/collection/story/content";
import { cn } from "@/utils/classNames";
// import StoryBackground from "@/ui/segments/collection/story/background";

type StoryProps = {
  uprightFontUrl: string;
  italicFontUrl: string;
  content: typeface;
};

export default function Story({ uprightFontUrl, italicFontUrl, content }: StoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // controls StoryContent visibility
  const [isPinned, setIsPinned] = useState(false); // fixes blob+content at viewport center
  const [showText, setShowText] = useState(false); // controls circle text visibility

  useEffect(() => {
    const section = sectionRef.current!;
    const blob = blobRef.current!;
    let rafId = 0;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    // Tunables
    const START_SIZE = 600; // px
    const EXPAND_SPAN_VH = 80; // how much scroll (in vh) to go 600px -> 100vw/100vh
    const LINGER_SPAN_VH = 50; // how long to keep it pinned at full size
    const TEXT_DISAPPEAR_AT = 0.99; // when to hide text during expansion (0.99 = 99% through expansion, right before StoryContent)

    const update = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const y = window.scrollY;

      // progress across the whole section (0→1), for your internal animations
      const wholeProg = clamp((y - sectionTop) / (sectionHeight - vh), 0, 1);
      setScrollProgress(wholeProg);

      // PHASES
      // 1) PRE: circle enters normally
      const triggerY = sectionTop + sectionHeight / 2 - vh / 2; // center-align moment
      // 2) EXPANDING (pinned): from triggerY to triggerY + EXPAND_SPAN
      const expandEndY = triggerY + (EXPAND_SPAN_VH / 100) * vh;
      // 3) LINGER (pinned): from expandEndY to expandEndY + LINGER_SPAN
      const lingerEndY = expandEndY + (LINGER_SPAN_VH / 100) * vh;
      // 4) POST: keep fullscreen and content visible when scrolling down

      let sizeProgress = 0;
      let pinned = false;
      let expanded = false;
      let showText = false;

      if (y < triggerY) {
        // PRE — circle not growing yet
        sizeProgress = 0;
        pinned = false;
        expanded = false;
        showText = false;
      } else if (y >= triggerY && y < expandEndY) {
        // EXPANDING — pin and interpolate 0→1
        pinned = true;
        const t = (y - triggerY) / (expandEndY - triggerY);
        // slightly faster growth (front-loaded)
        sizeProgress = clamp(t / 0.7, 0, 1);
        expanded = sizeProgress >= 0.999;
        // Show text when circle is at 600px, hide when 80% through expansion
        showText = sizeProgress < TEXT_DISAPPEAR_AT;
        // Debug logging - only log when text visibility changes
        if (showText !== sizeProgress < TEXT_DISAPPEAR_AT) {
          console.log(
            `Text visibility changed: expansion ${(sizeProgress * 100).toFixed(1)}%, showText: ${showText}`,
          );
        }
      } else if (y >= expandEndY && y < lingerEndY) {
        // LINGER — fully expanded and still pinned
        sizeProgress = 1;
        pinned = true;
        expanded = true;
        showText = false; // Text hidden during linger
      } else {
        // POST — keep fullscreen and content visible when scrolling down
        sizeProgress = 1; // Keep at fullscreen
        pinned = true; // Keep pinned
        expanded = true; // Keep StoryContent visible
        showText = false; // Text hidden in post phase
      }

      // Apply size
      const w = START_SIZE + (vw - START_SIZE) * sizeProgress;
      const h = START_SIZE + (vh - START_SIZE) * sizeProgress;
      blob.style.width = `${w}px`;
      blob.style.height = `${h}px`;
      blob.style.borderRadius = `${9999 - 9999 * sizeProgress}px`;

      // Pinning styles (centered)
      if (pinned) {
        // fix to viewport center
        blob.style.position = "fixed";
        blob.style.left = "50%";
        blob.style.top = "50%";
        blob.style.transform = "translate(-50%, -50%)";
      } else {
        // back to section-centric absolute center (so it can scroll away)
        blob.style.position = "absolute";
        blob.style.left = "50%";
        blob.style.top = "50%";
        blob.style.transform = "translate(-50%, -50%)";
      }

      // UI flags
      if (expanded !== isExpanded) setIsExpanded(expanded);
      if (pinned !== isPinned) setIsPinned(pinned);
      setShowText(showText);

      rafId = requestAnimationFrame(update);
    };

    let running = false;
    const startLoop = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(update);
      }
    };
    const stopLoop = () => {
      if (running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { root: null, threshold: 0 },
    );

    io.observe(section);
    update();

    return () => {
      io.disconnect();
      stopLoop();
    };
  }, [isExpanded, isPinned]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[440vh] w-screen overflow-clip bg-neutral-50"
    >
      {/* Header */}
      <header className="font-whisper sticky top-8 z-10 mx-auto flex w-full items-center justify-between gap-6 p-8 text-base tracking-wide text-black uppercase">
        <span>Left meta</span>
        <span>Center meta</span>
        <span>Right meta</span>
      </header>

      {/* Huge background word */}
      <div className="sticky top-[25vh] z-0 mx-auto flex w-full items-center justify-center pt-8">
        <h3
          className="font-mayday text-[32vw] leading-none font-black tracking-tight text-neutral-200 uppercase select-none"
          style={{ fontVariationSettings: `'wght' 900, 'wdth' 900, 'slnt' 0, 'opsz' 900` }}
        >
          story
        </h3>
      </div>

      {/* Animated black container */}
      <div
        id="animated-black-container"
        ref={blobRef}
        className="pointer-events-none z-10 flex items-center bg-black"
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: 99999,
        }}
        aria-hidden
      >
        <div className="font-whisper pl-[80px] text-left text-2xl leading-[1.4] font-normal text-white">
          <div>A little about</div>
          <div>the collection</div>
          <div>{content.name}</div>
        </div>
      </div>

      {/* Circle text - appears when circle is 600px, disappears at 99% expansion (right before StoryContent) */}
      <div
        className={cn(
          "pointer-events-none z-20 transition-opacity duration-300",
          showText ? "opacity-100" : "opacity-0",
        )}
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 600,
          height: 600,
        }}
      ></div>

      {/* StoryContent — appears only while fully expanded & pinned */}
      <div
        className={`z-20 transition-opacity duration-400 ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          position: isPinned ? "fixed" : "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: isExpanded ? "auto" : "none",
        }}
      >
        <StoryContent
          content={content}
          uprightFontUrl={uprightFontUrl}
          italicFontUrl={italicFontUrl}
          scrollProgress={useMotionValue(scrollProgress)}
        />
      </div>
    </section>
  );
}
