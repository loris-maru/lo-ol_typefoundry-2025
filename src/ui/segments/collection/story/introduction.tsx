"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/utils/classNames";
import useWebFontPair from "@/utils/use-web-font-pair";

type IntroductionProps = {
  content?: {
    title?: string;
    subtitle?: string;
    description?: string;
  } | null;

  familyName: string;
  currentWeight?: number;
  isItalic?: boolean;
  hasItalic?: boolean;

  uprightFontUrl: string;
  italicFontUrl?: string;

  onItalicToggle?: () => void;
};

export default function Introduction({
  content,
  familyName,
  currentWeight = 400,
  isItalic = false,
  hasItalic = false,
  uprightFontUrl,
  italicFontUrl,
  onItalicToggle,
}: IntroductionProps) {
  // Hooks at the top (fixed order)
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1.04]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.0, 1, 1]);

  // Stable preview family name
  const previewFamilyName = useMemo(
    () => `Preview-${familyName.replace(/\s+/g, "-")}`,
    [familyName],
  );

  // Load both faces under the same family; switching is instant via font-style
  const { loaded: fontLoaded, error: fontError } = useWebFontPair(
    previewFamilyName,
    uprightFontUrl,
    hasItalic ? italicFontUrl : undefined,
  );

  const fontStyle = useMemo<React.CSSProperties>(() => {
    const varSettings = [`'wght' ${currentWeight}`].join(", ");
    return {
      fontFamily: `"${previewFamilyName}", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
      fontVariationSettings: varSettings,
      fontStyle: isItalic && hasItalic ? "italic" : "normal",
      letterSpacing: "0.005em",
    };
  }, [previewFamilyName, currentWeight, isItalic, hasItalic]);

  const showSkeleton = !content || !fontLoaded;

  return (
    <section ref={containerRef} className="relative w-2/3 hyphens-auto">
      <motion.div style={{ scale, opacity }}>
        <div className="mb-8 flex items-center justify-between gap-4">
          {/* (Optional) Keep your external italic toggle handler */}
          {typeof onItalicToggle === "function" && <div className="hidden" />}
        </div>

        <div>
          {showSkeleton ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-2/3 rounded bg-neutral-200" />
              <div className="h-4 w-5/6 rounded bg-neutral-200" />
              <div className="h-4 w-3/4 rounded bg-neutral-200" />
            </div>
          ) : fontError ? (
            <p className="text-sm text-red-600">Couldn’t load font preview.</p>
          ) : (
            <div className="space-y-6">
              <p className="text-left text-[4.8vw] leading-tight text-white" style={fontStyle}>
                {content?.description ?? `The quick brown fox jumps over the lazy dog. 0123456789`}
              </p>

              {/* 🔒 Unchanged design for your weight/italic UI */}
              <div className="mt-3 flex items-center gap-4">
                <div
                  id="weight-indicator"
                  className="font-whisper rounded-full border border-solid border-white px-6 py-2 text-base font-medium tracking-wider uppercase"
                >
                  Weight: {currentWeight}
                </div>
                {hasItalic && (
                  <div className="flex items-center gap-3">
                    <span className="font-whisper text-sm tracking-wider text-white uppercase">
                      {isItalic ? "Italic" : "Upright"}
                    </span>
                    <button
                      type="button"
                      id="italic-toggle"
                      aria-label="Toggle italic"
                      onClick={onItalicToggle}
                      className="relative inline-flex h-6 w-11 items-center rounded-full border border-solid border-white transition-colors duration-300 focus:outline-none"
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
                          isItalic ? "translate-x-6" : "translate-x-1",
                        )}
                      />
                    </button>
                  </div>
                )}
              </div>
              {/* /unchanged */}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
