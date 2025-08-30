"use client";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { useFont } from "@react-hooks-library/core";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function VideoHero({
  content,
  onVideoLoaded,
}: {
  content: typeface;
  isMobile: boolean;
  onVideoLoaded: () => void;
}) {
  const fontName = slugify(content.name);
  const fontUrl = content.varFont;

  const { error, loaded: fontLoaded } = useFont(fontName, fontUrl);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // Debug scroll progress in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const unsubscribe = scrollYProgress.on("change", (latest) => {
        console.log("Scroll progress:", latest);
      });
      return unsubscribe;
    }
  }, [scrollYProgress]);

  // Add fallback values and ensure transforms work in production
  const width = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["100vw", "20vw", "16vw"]
  );

  const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 8, 14]);

  const height = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["100vh", "100vh", "40vh"]
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
  const groupScale = useTransform(widthVW, [100, 50], [1, 0.5]);

  const familyAbbreviation = content.name.slice(0, 2);

  const handleVideoLoad = () => {
    console.log("Video loaded in VideoHero, calling onVideoLoaded");
    onVideoLoaded();
  };

  if (error) {
    return <div>Error loading font</div>;
  }

  if (!fontLoaded) {
    return <div>Loading Font</div>;
  }

  return (
    <section ref={wrapperRef} className="relative h-[260vh]">
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        {/* Background title behind the video */}
        <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none">
          <div
            className="flex flex-col items-center text-center leading-[0.85] text-black select-none w-full"
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' 900, 'wdth' 900, 'slnt' 0, 'opsz' 900`,
            }}
          >
            <div className="text-[20vw] w-full">{content.name}</div>
            <div className="text-[20vw] w-full">Collection</div>
          </div>
        </div>

        {/* Small info block behind the video (top-4 left-4) */}
        <div className="fixed top-4 left-4 z-[-1] pointer-events-none">
          <div className="pointer-events-auto border border-black text-black">
            <div className="divide-y divide-black text-xs leading-tight font-whisper font-medium">
              <div className="px-3 py-2">{content.name} Collection</div>
              <div className="px-3 py-2">
                Total of {content.singleFontList.length} fonts
              </div>
              <div className="px-3 py-2">
                Axis: {content.axisNames.join(", ")}
              </div>
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
                fontFamily: fontName,
                fontVariationSettings: `'wght' ${fuWeight
                  .get()
                  .toFixed(1)}, 'wdth' 900, 'slnt' 0, 'opsz' 900`,
              }}
              className="text-[32vw] leading-[0.9] text-white"
            >
              {familyAbbreviation}
            </motion.div>

            <div className="mt-1 text-white leading-[1] text-[22px] font-whisper">
              <div className="mb-2">Discover a new</div>
              <div>{content.category} typeface</div>
            </div>
          </motion.div>

          <div className="relative w-full h-full bg-black overflow-hidden">
            {content.headerVideo ? (
              <video
                src={content.headerVideo}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={handleVideoLoad}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  minWidth: "100%",
                  minHeight: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            ) : (
              // Fallback to static image if no video
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    content.videoImageDesktop || content.thumbnailImage
                  })`,
                }}
                onLoad={handleVideoLoad}
              />
            )}
          </div>
        </motion.div>
      </div>

      <div className="h-[260vh]" />
    </section>
  );
}
