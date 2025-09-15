"use client";

import { useRef, useState, useEffect, useCallback } from "react";

import { motion, useInView, AnimatePresence } from "motion/react";
import { Typewriter } from "motion-plus-react";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export default function PlaygroundHeader({ content }: { content: typeface }) {
  const headerRef = useRef<HTMLDivElement>(null);
  // Removed unused isInView variable

  // State to control typewriter animation
  const [shouldStartTypewriter, setShouldStartTypewriter] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [showText, setShowText] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const fullText = `Normalize
Font Spirit`;

  // Check if header has entered 80% of the screen
  const isInView80 = useInView(headerRef, {
    amount: 0.8,
    once: false,
  });

  // Reverse typewriter effect
  const reverseTypewriter = useCallback(() => {
    let currentText = fullText;
    const interval = setInterval(() => {
      if (currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        setDisplayText(currentText);
      } else {
        clearInterval(interval);
        setShowText(false);
        setShouldStartTypewriter(false);
        setIsReversing(false);
        setDisplayText("");
      }
    }, 50); // Adjust speed as needed
  }, [fullText]);

  // Handle typewriter animation states
  useEffect(() => {
    if (isInView80 && !shouldStartTypewriter) {
      setShouldStartTypewriter(true);
      setIsReversing(false);
      setShowText(true);
    } else if (!isInView80 && shouldStartTypewriter) {
      setIsReversing(true);
      // Start reverse animation
      reverseTypewriter();
    }
  }, [isInView80, shouldStartTypewriter, reverseTypewriter]);

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
          <p>License: Print / Web / App</p>
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
          className="relative h-[500px] overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {showText && (
              <motion.span
                key="typewriter-text"
                className="absolute text-[14vw] leading-[1]"
                style={{
                  fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {shouldStartTypewriter && !isReversing ? (
                  <Typewriter
                    as="span"
                    className="block"
                    style={{
                      fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
                    }}
                    cursorStyle={{
                      fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900`,
                    }}
                  >
                    {fullText}
                  </Typewriter>
                ) : isReversing ? (
                  <span className="block">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </span>
                ) : (
                  <span className="block opacity-0">{fullText}</span>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
