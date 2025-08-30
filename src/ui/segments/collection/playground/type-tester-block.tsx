"use client";

import { TypefaceSettings } from "@/types/playground";
import { typeface } from "@/types/typefaces";
import SettingButton from "@/ui/segments/collection/playground/setting-button";
import SettingMenu from "@/ui/segments/collection/playground/setting-menu";
import { cn } from "@/utils/classNames";
import slugify from "@/utils/slugify";
import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type TypeTesterBlockProps = {
  defaultFontSize: number;
  defaultWeight: number;
  defaultLineHeight: number;
  defaultWidth: number;
  defaultSlant: number;
  defaultText: string;
  columns: 1 | 2 | 3;
  content: typeface;
};

export default function TypeTesterBlock({
  defaultFontSize,
  defaultWeight,
  defaultLineHeight,
  defaultWidth,
  defaultSlant,
  defaultText,
  columns,
  content,
}: TypeTesterBlockProps) {
  // FONT SETTINGS
  const [menuOpen, setMenuOpen] = useState(false);
  const [wght, setWght] = useState(defaultWeight);
  const [wdth, setWdth] = useState(defaultWidth);
  const [slnt, setSlant] = useState(defaultSlant);
  const [lh, setLh] = useState(defaultLineHeight);
  const [opsz, setOpsz] = useState<number>(900);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [italic, setItalic] = useState<boolean>(false);

  // EDITABLE CONTENT
  const [editableContent, setEditableContent] = useState(defaultText);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // REF
  const editableRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Calculate min height: 2 lines
  const minHeightPx = Math.max(0, fontSize * lh * 2);

  const autosize = useCallback(() => {
    const el = editableRef.current;
    if (!el) return;

    // Set min height to ensure proper sizing
    el.style.minHeight = `${minHeightPx}px`;

    // Auto-expand height based on content
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [minHeightPx]);

  // Resize when content changes
  useLayoutEffect(() => {
    autosize();
  }, [editableContent, autosize]);

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

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || "";
    setEditableContent(newContent);
    setShowPlaceholder(newContent.length === 0);
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    setShowPlaceholder(editableContent.length === 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to create new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
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

  const typefaceSettings: TypefaceSettings = {
    wght: wght,
    setWght: setWght,
    has_wdth: content.has_wdth,
    wdth: wdth,
    setWdth: setWdth,
    has_slnt: content.has_slnt,
    slnt: slnt,
    setSlnt: setSlant,
    has_opsz: content.has_opsz,
    opsz: opsz,
    setOpsz: setOpsz,
    has_italic: content.has_italic,
    italic: italic,
    setItalic: setItalic,
    lh: lh,
    setLh: setLh,
  };

  const fontFamily = slugify(content.name);

  // const fontFile = italic ? content.varFont : content.varFont

  return (
    <div className={cn("relative", getColumnClass())} ref={wrapperRef}>
      <div>
        <div>
          <div className="relative">
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleContentChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full resize-none border-0 focus:ring-0 text-black overflow-hidden whitespace-pre-wrap outline-none cursor-text"
              style={{
                fontFamily: fontFamily,
                fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
                fontSize: `${fontSize}px`,
                lineHeight: lh,
                minHeight: `${minHeightPx}px`,
              }}
            >
              {defaultText}
            </div>
          </div>
        </div>

        <SettingButton showMenu={menuOpen} setShowMenu={setMenuOpen} />

        {menuOpen && (
          <motion.div
            className="absolute right-4 top-14 z-20 w-64"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <SettingMenu settings={typefaceSettings} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
