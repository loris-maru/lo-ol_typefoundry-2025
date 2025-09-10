"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/utils/classNames";

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

function useWebFontPair(fontFamilyName: string, uprightUrl: string, italicUrl?: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function injectFace(id: string, css: string) {
      // Reuse style tag if present, else create it
      let el = document.getElementById(id) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = css;
    }

    async function load() {
      setLoaded(false);
      setError(null);
      try {
        const fmt = uprightUrl.endsWith(".woff2") ? "woff2" : "opentype";

        // Always load the upright face
        await injectFace(
          `font-${fontFamilyName}-upright`,
          `
          @font-face {
            font-family: "${fontFamilyName}";
            src: url("${uprightUrl}") format("${fmt}");
            font-style: normal;
            font-weight: 1 1000; /* variable-safe range */
            font-display: swap;
          }
        `,
        );

        // Conditionally load italic face (still not a hook; just runtime CSS)
        if (italicUrl) {
          const fmtItalic = italicUrl.endsWith(".woff2") ? "woff2" : "opentype";
          await injectFace(
            `font-${fontFamilyName}-italic`,
            `
            @font-face {
              font-family: "${fontFamilyName}";
              src: url("${italicUrl}") format("${fmtItalic}");
              font-style: italic;
              font-weight: 1 1000;
              font-display: swap;
            }
          `,
          );
        } else {
          // If no italic provided, make sure any previous italic tag is cleared
          const prevItalic = document.getElementById(`font-${fontFamilyName}-italic`);
          if (prevItalic) prevItalic.textContent = "";
        }
        // Nudge the font subsystem so layout can pick it up immediately
        await document.fonts?.load(`1rem "${fontFamilyName}"`);
        if (!cancelled) setLoaded(true);
      } catch (e) {
        if (!cancelled) setError(e);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fontFamilyName, uprightUrl, italicUrl]);

  return { loaded, error };
}

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
              <p className="text-left text-[4.6vw] leading-tight text-white" style={fontStyle}>
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
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                          isItalic ? "translate-x-6" : "translate-x-1"
                        }`}
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
