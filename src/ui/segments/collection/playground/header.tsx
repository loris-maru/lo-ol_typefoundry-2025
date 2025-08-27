"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function PlaygroundHeader() {
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="playground-header"
        ref={headerRef}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left text-neutral-500 text-sm border-y border-solid border-neutral-200 py-4 font-sans">
          <div>
            <p>Typeface: Fuzar</p>
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
        <motion.h2
          className="text-[16vw] font-fuzar font-black leading-[1] mt-2"
          style={{ fontVariationSettings: "'wght' 900, 'wdth' 900" }}
        >
          <motion.div
            className="overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            Normalize
          </motion.div>
          <motion.div
            className="overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Font Spirit
          </motion.div>
        </motion.h2>
      </motion.div>
    </AnimatePresence>
  );
}
