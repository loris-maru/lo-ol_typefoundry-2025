"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { typeface } from "@/types/typefaces";
import StoryBackground from "@/ui/segments/collection/story/background";
import StoryContent from "@/ui/segments/collection/story/content";

type StoryProps = {
  uprightFontUrl: string;
  italicFontUrl: string;
  content: typeface;
};

// Tunables
const START_SIZE = "38vh";
const TRACK_H = "600vh"; // increase to linger longer at full screen
const LINGER_AT = 0.2; // reach full screen by 20% of the track, then hold

export default function Story({ uprightFontUrl, italicFontUrl, content }: StoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Progress is 0 -> 1 from section center at viewport center, to section end at viewport center
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["center center", "end center"],
  });

  // Size morph: circle (60vh) -> full screen (100vw x 100vh) - bidirectional
  const width = useTransform(scrollYProgress, [0, LINGER_AT], ["60vh", "100vw"]);
  const height = useTransform(scrollYProgress, [0, LINGER_AT], ["60vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, LINGER_AT], ["9999px", "0px"]);

  // Text crossfade: show "round" text first, then swap to "full" text - bidirectional
  const roundTextOpacity = useTransform(scrollYProgress, [0, LINGER_AT - 0.05], [1, 0]);
  // StoryContent only appears when circle reaches full size (100vw x 100vh)
  const fullTextOpacity = useTransform(scrollYProgress, [LINGER_AT, LINGER_AT + 0.1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative bg-[#F5F5F5]">
      {/* Tall scroll track to allow a longer full-screen linger */}
      <div style={{ height: TRACK_H }}>
        {/* Sticky viewport */}
        <div className="sticky top-0 flex h-screen items-center justify-center">
          {/* Background behind the expanding shape */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <StoryBackground content={content} />
          </div>

          {/* Expanding black shape (starts as a perfect circle) */}
          <motion.div
            id="circle-to-fullscreen"
            className="z-10 grid h-[60vh] w-[60vh] flex-none place-items-center rounded-full bg-black will-change-[width,height,border-radius]"
            initial={{ width: START_SIZE, height: START_SIZE, borderRadius: "9999px" }}
            style={{ width, height, borderRadius }}
          >
            {/* Round-state text */}
            <motion.p
              style={{ opacity: roundTextOpacity }}
              className="font-whisper font-regular px-6 text-left text-lg text-white"
            >
              What does
              <br />
              Lemanic
              <br />
              say?
            </motion.p>

            {/* Full-screen-state text (overlaid, fades in) */}
            <motion.div
              style={{ opacity: fullTextOpacity }}
              className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-xl text-white md:text-2xl lg:text-3xl"
            >
              <StoryContent
                content={content}
                uprightFontUrl={uprightFontUrl}
                italicFontUrl={italicFontUrl}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
