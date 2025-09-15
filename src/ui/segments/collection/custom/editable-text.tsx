"use client";

import { useEffect, useMemo, useState } from "react";

// OPTION A: motion.dev (preferred if you said "motion/react")
import { motion } from "motion/react";

import { typeface } from "@/types/typefaces";
// If you’re using Framer Motion instead, swap the import:
// import { motion } from 'framer-motion';

const PHRASE = "Customise Lemanic";

export default function EditableText({ content }: { content: typeface }) {
  // Show the typewriter only after the expand animation finishes
  const [showType, setShowType] = useState(false);

  // Split the text once, for nice staggered reveal
  const letters = useMemo(() => PHRASE.split(""), []);

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
        {/* The expanding child: grows from center using scaleY */}
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
          {/* The background layer (child container) */}
          <div className="absolute inset-0 rounded-3xl" style={{ backgroundColor: "#A8E2FB" }} />

          {/* Typewriter appears after expand completes */}
          {showType && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <Typewriter text={PHRASE} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * Minimal “typewriter” using motion for a clean staggered reveal.
 * If you are on motion.dev, this works as-is.
 * If you’re on framer-motion, it also works (same API for variants/transition).
 */
function Typewriter({ text }: { text: string }) {
  const chars = text.split("");

  return (
    <motion.div
      className="text-center font-medium tracking-wide text-black"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            // first fade in the whole line, then letters stagger
            duration: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.04,
          },
        },
      }}
    >
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {chars.map((c, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "0.35em" },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
