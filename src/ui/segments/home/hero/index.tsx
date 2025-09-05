"use client";

import { useRef } from "react";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import { typeface } from "@/types/typefaces";

export default function HeroSection({ typefaces }: { typefaces: typeface[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // Add fallback values and ensure transforms work in production
  const width = useTransform(scrollYProgress, [0, 0.3, 0.6], ["100vw", "20vw", "16vw"]);

  const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 8, 14]);

  const height = useTransform(scrollYProgress, [0, 0.3, 0.6], ["100vh", "100vh", "40vh"]);
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
  const groupScale = useTransform(widthVW, [100, 50], [1, 0.5]);

  return (
    <section ref={wrapperRef} className="relative h-[260vh]">
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        {/* Background title behind the video */}
        <div className="pointer-events-none fixed inset-0 z-[-1] flex items-center justify-center">
          <div
            className="font-mayday flex w-full flex-col items-center text-center leading-[1] text-black uppercase select-none"
            style={{
              fontVariationSettings: `'wght' 900, 'wdth' 900, 'slnt' 0, 'opsz' 900`,
            }}
          >
            <div className="w-full text-[28vw]">lo-ol</div>
          </div>
        </div>

        {/* Small info block behind the video (top-4 left-4) */}
        <div className="pointer-events-none fixed top-4 left-4 z-[-1]">
          <div className="pointer-events-auto border border-black text-black">
            <div className="font-whisper divide-y divide-black text-xs leading-tight font-medium">
              <div className="px-3 py-2">lo-ol typefoundry</div>
              <div className="px-3 py-2">Total of {typefaces.length} Families</div>
              <div className="px-3 py-2">Latin + Hangeul</div>
            </div>
          </div>
        </div>

        <motion.div
          style={{ width, height, scale, opacity, borderRadius }}
          className="relative overflow-hidden shadow-2xl will-change-transform"
          initial={{ scale: 1, width: "100vw", height: "100vh" }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
            style={{ scale: groupScale }}
          >
            <motion.div
              style={{
                fontVariationSettings: `'wght' ${fuWeight
                  .get()
                  .toFixed(1)}, 'wdth' 900, 'slnt' 0, 'opsz' 900`,
              }}
              className="font-mayday text-[12vw] leading-[0.9] text-white uppercase"
            >
              <div>Type</div>
              <div>Foundry</div>
            </motion.div>

            <div className="font-whisper mt-1 w-[36vw] text-[22px] leading-normal text-white">
              Crafting modern, high-quality Hangul & Latin fonts to elevate your brand and projects.
            </div>
          </motion.div>

          <div className="relative h-full w-full overflow-hidden bg-black">
            <video
              src="https://player.vimeo.com/progressive_redirect/playback/1028761726/rendition/1080p/file.mp4?loc=external&log_user=0&signature=2bd7ddaa7f3d29e473341d2cf4044dbd569eddaa5e09da41581faa43265feb7a"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                minWidth: "100%",
                minHeight: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
        </motion.div>
      </div>

      <div className="h-[260vh]" />
    </section>
  );
}
