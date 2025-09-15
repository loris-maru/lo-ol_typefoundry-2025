"use client";

import { useState } from "react";

import { motion } from "motion/react";
import { Typewriter } from "motion-plus-react";

import { typeface } from "@/types/typefaces";

export default function TypeTesterCustomise({ content }: { content: typeface }) {
  const PHRASE = "Customise Lemanic";

  const [showType, setShowType] = useState(false);

  return (
    <section
      className="relative flex min-h-[140vh] items-center justify-center bg-white"
      // ^ a bit taller than viewport so you can scroll into it
    >
      {/* This wrapper is what enters the viewport and triggers the animation */}
      <motion.div
        initial="collapsed"
        whileInView="expanded"
        viewport={{ amount: 0.8, once: true }}
        // amount: 0.8 → triggers when 80% of the section is in the viewport
        variants={{
          collapsed: {},
          expanded: {},
        }}
        className="relative w-full max-w-6xl"
      >
        <motion.div
          initial={{ scaleY: 0 }}
          variants={{
            expanded: { scaleY: 1 },
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setShowType(true)}
          style={{ transformOrigin: "50% 50%" }} // grow from vertical center
          className="relative mx-auto h-[60vh] w-full rounded-3xl"
        >
          <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: "#A8E2FB" }} />

          {showType && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <Typewriter textStyle={{ fontFamily: content.name }} text={PHRASE} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
