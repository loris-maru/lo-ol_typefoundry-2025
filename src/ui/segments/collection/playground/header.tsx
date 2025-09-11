"use client";

import { useRef, useState, useEffect } from "react";

import { motion, useInView } from "motion/react";
import { Typewriter } from "motion-plus-react";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export default function PlaygroundHeader({ content }: { content: typeface }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, {
    amount: 0.7,
    once: false,
  });

  // State to control when Typewriter should start animating
  const [shouldStartTypewriter, setShouldStartTypewriter] = useState(false);

  // Check if header has entered 80% of the screen
  const isInView80 = useInView(headerRef, {
    amount: 0.8,
    once: false,
  });

  // Start typewriter when 80% of header is in view
  useEffect(() => {
    if (isInView80 && !shouldStartTypewriter) {
      setShouldStartTypewriter(true);
    } else if (!isInView80 && shouldStartTypewriter) {
      setShouldStartTypewriter(false);
    }
  }, [isInView80, shouldStartTypewriter]);

  return (
    <motion.div
      key="playground-header"
      id="playground-header"
      className="relative"
      ref={headerRef}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="font-whisper grid grid-cols-1 gap-6 border-y border-solid border-neutral-200 py-4 text-left text-sm font-normal text-neutral-500 sm:grid-cols-3">
        <div>
          <p>Typeface: {content.name}</p>
          <p>Designer: Noheul Lee</p>
        </div>
        <div>
          <p>Release: 2024</p>
          <p>License: Desktop / Web / App</p>
        </div>
        <div>
          <p>Languages: Latin, Extended</p>
          <p>Features: Stylistic sets, ligatures</p>
        </div>
      </div>
      <motion.div
        id="playground-header-title"
        className="relative mt-2"
        style={{ fontVariationSettings: "'wght' 900, 'wdth' 900" }}
      >
        <div
          style={{
            fontFamily: slugify(content.name),
          }}
          className="relative h-[52vh] overflow-hidden"
        >
          {shouldStartTypewriter ? (
            <Typewriter
              as="span"
              className="absolute text-[14vw] leading-[1]"
              style={{
                fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
              }}
              cursorStyle={{
                fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900`,
              }}
            >
              {`Normalize
Font Spirit`}
            </Typewriter>
          ) : (
            <span
              className="absolute text-[14vw] leading-[1]"
              style={{
                fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
              }}
            >
              {`Normalize
Font Spirit`}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
