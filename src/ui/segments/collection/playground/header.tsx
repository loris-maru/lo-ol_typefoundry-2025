"use client";

import { useRef } from "react";

import { motion, useInView } from "motion/react";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export default function PlaygroundHeader({ content }: { content: typeface }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, {
    amount: 0.7,
    once: false,
  });

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
          className="relative h-[28vh] overflow-hidden"
        >
          <motion.span
            className="absolute text-[14vw] leading-[1]"
            style={{
              fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900`,
            }}
            initial={{ y: 300 }}
            animate={{ y: isInView ? 0 : 300 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Normalize
          </motion.span>
        </div>
        <div
          style={{
            fontFamily: slugify(content.name),
          }}
          className="relative h-[28vh] overflow-hidden"
        >
          <motion.span
            className="absolute text-[14vw] leading-[1]"
            style={{
              fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900`,
            }}
            initial={{ y: 300 }}
            animate={{ y: isInView ? 0 : 300 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Font Spirit
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
