"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { TypefaceSettings } from "@/types/playground";
import { typeface } from "@/types/typefaces";
import SelectionSettingMenu from "@/ui/segments/collection/playground/selection-setting-menu";
import SettingButton from "@/ui/segments/collection/playground/setting-button";
import SettingMenu from "@/ui/segments/collection/playground/setting-menu";
import { cn } from "@/utils/classNames";
import slugify from "@/utils/slugify";

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
  const [fontSize] = useState(defaultFontSize);
  const [italic, setItalic] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  // EDITABLE CONTENT
  const [editableContent, setEditableContent] = useState(defaultText);

  // TEXT SELECTION
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [storedRange, setStoredRange] = useState<Range | null>(null);

  // SELECTION-SPECIFIC SETTINGS (only used when text is selected)
  const [selectionWght, setSelectionWght] = useState(defaultWeight);
  const [selectionWdth, setSelectionWdth] = useState(defaultWidth);
  const [selectionSlnt, setSelectionSlnt] = useState(defaultSlant);
  const [selectionOpsz, setSelectionOpsz] = useState(900);
  const [selectionItalic, setSelectionItalic] = useState(false);

  // BLOCK-LEVEL SETTINGS
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundType, setBackgroundType] = useState<"transparent" | "color" | "image">(
    "transparent",
  );
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingRight, setPaddingRight] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);

  // REF
  const editableRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const selectionMenuRef = useRef<HTMLDivElement>(null);

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

  // Resize when padding changes
  useLayoutEffect(() => {
    autosize();
  }, [paddingTop, paddingBottom, autosize]);

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
  };

  const handleSelectionChange = () => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setSelection(null);
      setSelectionPosition(null);
      setMenuOpen(false);
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const selectedText = windowSelection.toString().trim();

    if (selectedText.length === 0) {
      setSelection(null);
      setSelectionPosition(null);
      setStoredRange(null);
      setMenuOpen(false);
      return;
    }

    // Get selection position relative to the editable element
    const rect = range.getBoundingClientRect();
    const editableRect = editableRef.current?.getBoundingClientRect();

    if (editableRect) {
      setSelectionPosition({
        x: rect.left - editableRect.left + rect.width / 2,
        y: rect.top - editableRect.top + rect.height + 40, // 40px below selection
      });
    }

    // Get selection range within the editable content
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    setSelection({
      start: startOffset,
      end: endOffset,
      text: selectedText,
    });

    // Store the range for later use
    const clonedRange = range.cloneRange();
    setStoredRange(clonedRange);
    console.log("Stored range:", clonedRange, "Selection:", selectedText);

    // Reset selection-specific settings to current global values
    setSelectionWght(wght);
    setSelectionWdth(wdth);
    setSelectionSlnt(slnt);
    setSelectionOpsz(opsz);
    setSelectionItalic(italic);

    console.log("Selection made - setting italic to:", italic);

    // Open menu when text is selected
    setMenuOpen(true);
  };

  const handleFocus = () => {
    // Handle focus event
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Check if focus is moving to the selection menu
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (selectionMenuRef.current && selectionMenuRef.current.contains(relatedTarget)) {
      return; // Don't close menu if focus is moving to the selection menu
    }

    // Close menu when losing focus (with a small delay to allow menu interaction)
    setTimeout(() => {
      setMenuOpen(false);
      setSelection(null);
      setSelectionPosition(null);
      setStoredRange(null);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to create new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if click is on the selection menu
    const target = e.target as HTMLElement;
    if (selectionMenuRef.current && selectionMenuRef.current.contains(target)) {
      e.preventDefault();
      return;
    }
  };

  const applySettingsToSelection = () => {
    console.log("applySettingsToSelection called", {
      selection,
      storedRange,
      selectionWght,
      selectionWdth,
      selectionSlnt,
      selectionOpsz,
      selectionItalic,
    });

    if (!selection || !editableRef.current) {
      console.log("No selection or editable ref, returning");
      return;
    }

    // Find the selected text in the editable content and wrap it with a span
    const editableElement = editableRef.current;
    const textContent = editableElement.textContent || "";

    if (selection.start >= 0 && selection.end <= textContent.length) {
      // Create a new content with the selected text wrapped in a span
      const beforeText = textContent.substring(0, selection.start);
      const selectedText = textContent.substring(selection.start, selection.end);
      const afterText = textContent.substring(selection.end);

      // Create the span with the current selection settings
      const span = document.createElement("span");

      // Build fontVariationSettings string with only available axes
      let fontVariationSettings = `'wght' ${selectionWght}`;

      if (content.has_wdth) {
        fontVariationSettings += `, 'wdth' ${selectionWdth}`;
      }
      if (content.has_slnt) {
        fontVariationSettings += `, 'slnt' ${selectionSlnt}`;
      }
      if (content.has_opsz) {
        fontVariationSettings += `, 'opsz' ${selectionOpsz}`;
      }

      span.style.fontVariationSettings = fontVariationSettings;

      // Handle italic - use separate font family for italic
      if (selectionItalic && content.has_italic) {
        // Use italic font family
        span.style.fontFamily = italicFontFamily;
        span.style.fontStyle = "normal"; // Reset fontStyle since we're using a different font family
      } else {
        // Use regular font family
        span.style.fontFamily = fontFamily;
        span.style.fontStyle = "normal";
      }
      span.textContent = selectedText;

      console.log("Content axes available:", {
        has_wdth: content.has_wdth,
        has_slnt: content.has_slnt,
        has_opsz: content.has_opsz,
        has_italic: content.has_italic,
      });
      console.log("Selection values:", {
        selectionWght,
        selectionWdth,
        selectionSlnt,
        selectionOpsz,
        selectionItalic,
      });
      console.log("Italic handling:", {
        selectionItalic,
        has_italic: content.has_italic,
        has_slnt: content.has_slnt,
        fontFamily: selectionItalic && content.has_italic ? italicFontFamily : fontFamily,
        finalFontStyle: "normal",
      });
      console.log(
        "Created span with styles:",
        span.style.fontVariationSettings,
        span.style.fontStyle,
      );
      console.log("Text parts:", { beforeText, selectedText, afterText });

      // Update the content
      editableElement.innerHTML = beforeText + span.outerHTML + afterText;

      console.log("Updated content with styled span");
    } else {
      console.log("Selection range is invalid for current content");
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

  // Selection-specific settings (for SelectionSettingMenu)
  const selectionSettings: TypefaceSettings = {
    wght: selectionWght,
    setWght: (value) => {
      setSelectionWght(value);
      applySettingsToSelection();
    },
    has_wdth: content.has_wdth,
    wdth: selectionWdth,
    setWdth: (value) => {
      setSelectionWdth(value);
      applySettingsToSelection();
    },
    has_slnt: content.has_slnt,
    slnt: selectionSlnt,
    setSlnt: (value) => {
      setSelectionSlnt(value);
      applySettingsToSelection();
    },
    has_opsz: content.has_opsz,
    opsz: selectionOpsz,
    setOpsz: (value) => {
      setSelectionOpsz(value);
      applySettingsToSelection();
    },
    has_italic: content.has_italic,
    italic: selectionItalic,
    setItalic: (value) => {
      setSelectionItalic(value);
      applySettingsToSelection();
    },
    lh: lh, // Not used in selection menu
    setLh: setLh, // Not used in selection menu
  };

  // Block-level settings (for SettingMenu)
  const blockSettings: TypefaceSettings = {
    wght: wght, // Not used in block menu
    setWght: setWght, // Not used in block menu
    has_wdth: content.has_wdth, // Not used in block menu
    wdth: wdth, // Not used in block menu
    setWdth: setWdth, // Not used in block menu
    has_slnt: content.has_slnt, // Not used in block menu
    slnt: slnt, // Not used in block menu
    setSlnt: setSlant, // Not used in block menu
    has_opsz: content.has_opsz, // Not used in block menu
    opsz: opsz, // Not used in block menu
    setOpsz: setOpsz, // Not used in block menu
    has_italic: content.has_italic, // Not used in block menu
    italic: italic, // Not used in block menu
    setItalic: setItalic, // Not used in block menu
    lh: lh,
    setLh: setLh,
    textAlign: textAlign,
    setTextAlign: setTextAlign,
  };

  const fontFamily = slugify(content.name);
  const italicFontFamily = slugify(`${content.name}Italic`);

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
              onMouseUp={handleSelectionChange}
              onKeyUp={handleSelectionChange}
              onClick={handleClick}
              className="w-full cursor-text resize-none overflow-hidden border-0 whitespace-pre-wrap outline-none focus:ring-0"
              style={{
                fontFamily: fontFamily,
                fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
                fontSize: `${fontSize}px`,
                lineHeight: lh,
                minHeight: `${minHeightPx}px`,
                color: textColor,
                textAlign: textAlign,
                backgroundColor:
                  backgroundType === "transparent"
                    ? "transparent"
                    : backgroundType === "color"
                      ? backgroundColor
                      : "transparent",
                backgroundImage:
                  backgroundType === "image" && backgroundImage
                    ? `url(${backgroundImage})`
                    : "none",
                backgroundSize: backgroundType === "image" ? "cover" : "auto",
                backgroundPosition: backgroundType === "image" ? "center" : "initial",
                backgroundRepeat: backgroundType === "image" ? "no-repeat" : "repeat",
                paddingTop: `${paddingTop}px`,
                paddingRight: `${paddingRight}px`,
                paddingBottom: `${paddingBottom}px`,
                paddingLeft: `${paddingLeft}px`,
              }}
            >
              {defaultText}
            </div>
          </div>
        </div>

        <SettingButton showMenu={menuOpen} setShowMenu={setMenuOpen} />

        {menuOpen && (
          <motion.div
            className="absolute z-20 w-64"
            style={{
              left: selectionPosition ? `${selectionPosition.x - 128}px` : "right-4",
              top: selectionPosition ? `${selectionPosition.y}px` : "56px", // 8px below button (48px button height + 8px)
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {selection ? (
              <div ref={selectionMenuRef}>
                <SelectionSettingMenu
                  settings={selectionSettings}
                  isOpen={menuOpen}
                  onClose={() => {
                    setMenuOpen(false);
                    setSelection(null);
                    setSelectionPosition(null);
                    setStoredRange(null);
                  }}
                />
              </div>
            ) : (
              <SettingMenu
                settings={blockSettings}
                textStyling={{
                  textColor,
                  setTextColor,
                }}
                background={{
                  backgroundColor,
                  setBackgroundColor,
                  backgroundType,
                  setBackgroundType,
                  backgroundImage,
                  setBackgroundImage,
                }}
                padding={{
                  paddingTop,
                  setPaddingTop,
                  paddingRight,
                  setPaddingRight,
                  paddingBottom,
                  setPaddingBottom,
                  paddingLeft,
                  setPaddingLeft,
                }}
                onClose={() => {
                  setMenuOpen(false);
                }}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
