"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function VideoHero({ videoSrc }: { videoSrc: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  const width = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["100vw", "20vw", "16vw"]
  );
  const height = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["100vh", "100vh", "60vh"]
  );
  const scale = useTransform(scrollYProgress, [0.6, 0.9, 1], [1, 0.3, 0.1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const widthVW = useTransform(scrollYProgress, [0, 0.3, 0.6], [100, 20, 16]);
  const fuWeightRaw = useTransform(widthVW, [100, 50], [900, 400], {
    clamp: true,
  });
  const fuWeight = useSpring(fuWeightRaw, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });
  const groupScale = useTransform(widthVW, (w) => (w >= 50 ? 1 : w / 50));

  return (
    <section ref={wrapperRef} className="relative h-[260vh]">
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* Background title behind the video */}
        <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none">
          <div className="text-center font-black leading-[0.85] text-black select-none w-full">
            <div className="text-[20vw] w-full">Fuzar</div>
            <div className="text-[20vw] w-full">Collection</div>
          </div>
        </div>

        {/* Small info block behind the video (top-4 left-4) */}
        <div className="fixed top-4 left-4 z-[-1] pointer-events-none">
          <div className="pointer-events-auto rounded-md border border-black bg-white/95 text-black shadow-sm backdrop-blur-sm">
            <div className="divide-y divide-black text-xs leading-tight">
              <div className="px-3 py-2">Total of 76 fonts</div>
              <div className="px-3 py-2">3 Axis</div>
              <div className="px-3 py-2">Weight, Width, Slant</div>
            </div>
          </div>
        </div>

        <motion.div
          style={{ width, height, scale, opacity }}
          className="relative rounded-2xl overflow-hidden shadow-2xl will-change-transform"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
            style={{ scale: groupScale }}
          >
            <motion.div
              style={{
                fontFamily: "Fuzar, ui-sans-serif, system-ui",
                fontVariationSettings: `'wght' ${fuWeight.get().toFixed(1)}`,
              }}
              className="text-[32vw] font-black leading-[0.9] text-white"
            >
              Fu
            </motion.div>

            <div className="mt-1 text-white leading-[1] text-[22px]">
              <div>Discover a new</div>
              <div>sans-serif typeface</div>
            </div>
          </motion.div>

          <video
            src={videoSrc}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            loop
          />
        </motion.div>
      </div>

      <div className="h-[260vh]" />
    </section>
  );
}
