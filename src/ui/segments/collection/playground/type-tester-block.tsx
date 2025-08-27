"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface TypeTesterBlockProps {
  defaultFontSize: number;
  defaultWeight: number;
  defaultLineHeight: number;
  defaultWidth: number;
  defaultSlant: number;
  defaultText: string;
  columns: 1 | 2 | 3;
}

export default function TypeTesterBlock({
  defaultFontSize,
  defaultWeight,
  defaultLineHeight,
  defaultWidth,
  defaultSlant,
  defaultText,
  columns,
}: TypeTesterBlockProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wght, setWght] = useState(defaultWeight);
  const [wdth, setWdth] = useState(defaultWidth);
  const [slnt, setSlnt] = useState(defaultSlant);
  const [lh, setLh] = useState(defaultLineHeight);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [textareaValue, setTextareaValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Calculate min height: 2 lines
  const minHeightPx = Math.max(0, fontSize * lh * 2);

  const autosize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    // Reset first so shrink works on deletion or style changes
    el.style.height = "0px"; // or "auto"
    const next = Math.max(el.scrollHeight, minHeightPx);
    el.style.height = `${next}px`;
  }, [minHeightPx]);

  // Resize when content changes
  useLayoutEffect(() => {
    autosize();
  }, [textareaValue, autosize]);

  // Resize when typography/axes change
  useLayoutEffect(() => {
    autosize();
  }, [fontSize, lh, wght, wdth, slnt, autosize]);

  // Re-run after font loads (metrics can change)
  useEffect(() => {
    let cancelled = false;
    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) autosize();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [autosize]);

  // Re-run on container/viewport width changes (wrap affects height)
  useEffect(() => {
    if (!wrapperRef.current) return;
    // Clean old observer if any
    resizeObserverRef.current?.disconnect();

    const ro = new ResizeObserver(() => autosize());
    ro.observe(wrapperRef.current);
    resizeObserverRef.current = ro;

    return () => {
      ro.disconnect();
      if (resizeObserverRef.current === ro) resizeObserverRef.current = null;
    };
  }, [autosize]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-1";
      case 3:
        return "col-span-1";
      default:
        return "col-span-1";
    }
  };

  return (
    <div className={`${getColumnClass()} relative`} ref={wrapperRef}>
      {/* Type Tester Block */}
      <div>
        <div className="mb-4">
          <textarea
            ref={textareaRef}
            value={textareaValue}
            onChange={handleTextareaChange}
            rows={1}
            className="w-full resize-none border-0 focus:ring-0 text-black placeholder-black overflow-hidden whitespace-pre-wrap"
            placeholder={defaultText}
            style={{
              fontFamily: "Fuzar, ui-sans-serif, system-ui",
              fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}`,
              fontSize: `${fontSize}px`,
              lineHeight: lh, // number is fine in React CSSProperties
              minHeight: `${minHeightPx}px`,
            }}
          />
        </div>

        {/* Settings Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute right-4 top-4 z-20 w-8 h-8 rounded-lg border border-black/10 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Settings Menu */}
        {menuOpen && (
          <motion.div
            className="absolute right-4 top-14 z-20 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="mb-1 block">Weight ({wght})</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="1"
                  value={wght}
                  onChange={(e) => setWght(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block">Width ({wdth})</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="1"
                  value={wdth}
                  onChange={(e) => setWdth(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block">Slant ({slnt})</span>
                <input
                  type="range"
                  min="-15"
                  max="0"
                  step="1"
                  value={slnt}
                  onChange={(e) => setSlnt(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block">Line Height ({lh})</span>
                <input
                  type="range"
                  min="0.8"
                  max="2"
                  step="0.05"
                  value={lh}
                  onChange={(e) => setLh(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="mb-1 block">Font Size ({fontSize}px)</span>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </label>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
