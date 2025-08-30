"use client";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left text-neutral-500 text-sm border-y border-solid border-neutral-200 font-normal py-4 font-whisper">
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
          className="relative overflow-hidden h-[28vh]"
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
          className="relative overflow-hidden h-[28vh]"
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
