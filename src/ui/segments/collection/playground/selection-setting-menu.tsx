import { useEffect, useRef } from "react";
import { TypefaceSettings } from "@/types/playground";

export default function SelectionSettingMenu({
  settings,
  onClose,
  isOpen = false,
}: {
  settings: TypefaceSettings;
  onClose?: () => void;
  isOpen?: boolean;
}) {
  const {
    wght,
    setWght,
    has_wdth,
    wdth,
    setWdth,
    has_slnt,
    slnt,
    setSlnt,
    has_opsz,
    opsz,
    setOpsz,
    has_italic,
    italic,
    setItalic,
  } = settings;

  const highlightSpanRef = useRef<HTMLSpanElement | null>(null);

  // Apply/remove background color to selected text when menu opens/closes
  useEffect(() => {
    console.log("SelectionSettingMenu useEffect triggered, isOpen:", isOpen);

    if (isOpen) {
      // Add a small delay to ensure the selection is stable
      const timeoutId = setTimeout(() => {
        // Store the current selection when menu opens
        const selection = window.getSelection();
        console.log("Selection object:", selection);

        if (!selection || selection.rangeCount === 0) {
          console.log("No selection found");
          return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        console.log("Selected text:", selectedText);

        if (!selectedText) {
          console.log("No selected text");
          return;
        }

        // Find the container element that contains the selected text
        const container =
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : (range.commonAncestorContainer as Element);

        console.log("Container element:", container);

        if (!container) {
          console.log("No container found");
          return;
        }

        // Create a wrapper span around the selected text
        const span = document.createElement("span");
        span.style.backgroundColor = "#dbeafe"; // light blue
        span.style.padding = "2px 4px";
        span.style.borderRadius = "2px";
        span.className = "selection-highlight";
        span.style.display = "inline";
        span.style.color = "inherit"; // Preserve text color
        span.style.fontFamily = "inherit"; // Preserve font family
        span.style.fontSize = "inherit"; // Preserve font size

        console.log("Created highlight span:", span);

        try {
          range.surroundContents(span);
          highlightSpanRef.current = span;
          console.log("Successfully highlighted selection with surroundContents:", selectedText);
        } catch (e) {
          // If surroundContents fails, try a different approach
          console.log("Could not surround contents, trying alternative approach", e);

          // Try to extract the text and replace it with a highlighted version
          const textNode = range.startContainer;
          if (textNode.nodeType === Node.TEXT_NODE) {
            const textContent = textNode.textContent || "";
            const beforeText = textContent.substring(0, range.startOffset);
            const selectedText = textContent.substring(range.startOffset, range.endOffset);
            const afterText = textContent.substring(range.endOffset);

            console.log("Text parts:", { beforeText, selectedText, afterText });

            // Create a new text node with the highlighted selection
            const beforeNode = document.createTextNode(beforeText);
            const afterNode = document.createTextNode(afterText);

            span.textContent = selectedText;

            // Replace the text node with our new structure
            const parent = textNode.parentNode;
            if (parent) {
              parent.insertBefore(beforeNode, textNode);
              parent.insertBefore(span, textNode);
              parent.insertBefore(afterNode, textNode);
              parent.removeChild(textNode);
              highlightSpanRef.current = span;
              console.log("Successfully highlighted selection with alternative method");
            }
          }
        }
      }, 100); // Small delay to ensure selection is stable

      return () => clearTimeout(timeoutId);
    } else {
      // Remove background color when menu closes, but preserve font styling
      if (highlightSpanRef.current) {
        const span = highlightSpanRef.current;
        const parent = span.parentNode;
        if (parent) {
          // Create a new span with the same font styling but without the highlight background
          const styledSpan = document.createElement("span");
          styledSpan.style.fontVariationSettings = span.style.fontVariationSettings;
          styledSpan.style.fontFamily = span.style.fontFamily;
          styledSpan.style.fontStyle = span.style.fontStyle;
          styledSpan.textContent = span.textContent || "";

          parent.replaceChild(styledSpan, span);
          parent.normalize();
        }
        highlightSpanRef.current = null;
        console.log("Removed selection highlight, preserved font styling");
      } else {
        // Fallback: remove any existing highlights but preserve font styling
        const highlightedSpans = document.querySelectorAll(".selection-highlight");
        highlightedSpans.forEach((span) => {
          const parent = span.parentNode;
          if (parent) {
            // Create a new span with the same font styling but without the highlight background
            const styledSpan = document.createElement("span");
            styledSpan.style.fontVariationSettings = span.style.fontVariationSettings;
            styledSpan.style.fontFamily = span.style.fontFamily;
            styledSpan.style.fontStyle = span.style.fontStyle;
            styledSpan.textContent = span.textContent || "";

            parent.replaceChild(styledSpan, span);
            parent.normalize();
          }
        });
        console.log("Removed all selection highlights via fallback, preserved font styling");
      }
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (highlightSpanRef.current) {
        const span = highlightSpanRef.current;
        const parent = span.parentNode;
        if (parent) {
          // Create a new span with the same font styling but without the highlight background
          const styledSpan = document.createElement("span");
          styledSpan.style.fontVariationSettings = span.style.fontVariationSettings;
          styledSpan.style.fontFamily = span.style.fontFamily;
          styledSpan.style.fontStyle = span.style.fontStyle;
          styledSpan.textContent = span.textContent || "";

          parent.replaceChild(styledSpan, span);
          parent.normalize();
        }
        highlightSpanRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="absolute right-0 z-[99999] w-64 rounded-lg bg-white p-3 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close settings menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <div className="space-y-3 text-sm font-normal">
        <label className="block">
          <span className="mb-1 block font-sans">Weight ({wght})</span>
          <input
            type="range"
            min={100}
            max={900}
            step={1}
            value={wght}
            onChange={(e) => setWght(+e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="custom-slider w-full"
          />
        </label>
        {has_wdth && (
          <label className="block">
            <span className="mb-1 block font-sans">Width ({wdth})</span>
            <input
              type="range"
              min={100}
              max={900}
              step={1}
              value={wdth}
              onChange={(e) => setWdth(+e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="custom-slider w-full"
            />
          </label>
        )}
        {has_slnt && (
          <label className="block">
            <span className="mb-1 block font-sans">Slant ({slnt})</span>
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={slnt}
              onChange={(e) => setSlnt(+e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="custom-slider w-full"
            />
          </label>
        )}
        {has_opsz && (
          <label className="block">
            <span className="mb-1 block font-sans">Optical Size ({opsz})</span>
            <input
              type="range"
              min={100}
              max={900}
              step={1}
              value={opsz}
              onChange={(e) => setOpsz(+e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="custom-slider w-full"
            />
          </label>
        )}
        {has_italic && (
          <label className="flex flex-row items-start gap-2">
            <span className="mb-1 block font-sans">Italic</span>
            <input
              type="checkbox"
              checked={italic}
              onChange={(e) => {
                console.log("Italic checkbox changed:", e.target.checked);
                setItalic(e.target.checked);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="relative top-1"
            />
          </label>
        )}
      </div>
    </div>
  );
}
