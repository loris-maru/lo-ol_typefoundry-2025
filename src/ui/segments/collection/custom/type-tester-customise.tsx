"use client";

import { useState, useRef, useEffect } from "react";

import { MotionValue, useMotionValueEvent } from "motion/react";

import { useCartStore, SingleCartItem } from "@/states/cart";
import { typeface } from "@/types/typefaces";
import CartList from "@/ui/segments/collection/custom/cart-list";
import { generateCartKey } from "@/utils/generateCartKey";

type TypeTesterCustomiseProps = {
  content: typeface;
  height: MotionValue<string>;
  textColor: string;
  textAlign: "left" | "center" | "right";
  backgroundType: "color" | "image";
  backgroundColor: string;
  backgroundImage: string | null;
  lineHeight: number;
  wght: number;
  wdth: number;
  slnt: number;
  italic: boolean;
  opsz: number;
};

export default function TypeTesterCustomise({
  content,
  height,
  textColor,
  textAlign,
  backgroundType,
  backgroundColor,
  backgroundImage,
  lineHeight,
  wght,
  wdth,
  slnt,
  italic,
  opsz,
}: TypeTesterCustomiseProps) {
  const [customText, setCustomText] = useState<string>(`Customize ${content.name}`);

  const [showType, setShowType] = useState(false);

  // Cart
  const { addToCart, removeFromCart, cart } = useCartStore();

  // Filter cart items for this specific font family
  const customCartItems = cart.filter((item) => item.family === content.name);

  // Ref for the editable content
  const editableRef = useRef<HTMLDivElement>(null);

  // Listen to height changes and show/hide typewriter accordingly
  useMotionValueEvent(height, "change", (latest) => {
    const heightValue = parseFloat(latest);
    if (heightValue > 0) {
      // Show typewriter when height starts growing
      setShowType(true);
    } else {
      // Hide typewriter when height goes back to 0
      setShowType(false);
    }
  });

  // Event handlers following the same pattern as type-tester-block
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || "";
    setCustomText(newContent);

    // Force text direction on every input
    if (editableRef.current) {
      // Completely reset the element's direction
      editableRef.current.setAttribute("dir", "ltr");
      editableRef.current.setAttribute("lang", "en");
      editableRef.current.style.direction = "ltr";
      editableRef.current.style.textAlign = "left";
      editableRef.current.style.unicodeBidi = "normal";
      editableRef.current.style.writingMode = "horizontal-tb";

      // Force the text content to be LTR by replacing it
      const textNode = editableRef.current.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent || "";
        if (text !== newContent) {
          editableRef.current.textContent = newContent;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to create new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  const handleFocus = () => {
    // Ensure cursor is positioned at the end when focused
    if (editableRef.current) {
      // Force text direction aggressively
      editableRef.current.setAttribute("dir", "ltr");
      editableRef.current.setAttribute("lang", "en");
      editableRef.current.style.direction = "ltr";
      editableRef.current.style.textAlign = "left";
      editableRef.current.style.unicodeBidi = "normal";
      editableRef.current.style.writingMode = "horizontal-tb";

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false); // Collapse to end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // Ensure text direction is always LTR
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.setAttribute("dir", "ltr");
      editableRef.current.setAttribute("lang", "en");
      editableRef.current.style.direction = "ltr";
      editableRef.current.style.textAlign = "left";
      editableRef.current.style.unicodeBidi = "normal";
      editableRef.current.style.writingMode = "horizontal-tb";
    }
  }, [customText]);

  const fontID = () => {
    let name = `${content.name}_wght${wght}`;

    if (content.has_wdth) {
      name += `_wdth${wdth}`;
    }

    if (content.has_slnt) {
      name += `_slnt${slnt}`;
    }

    if (content.has_opsz) {
      name += `_opsz${opsz}`;
    }

    if (italic) {
      name += "_italic";
    }

    return name;
  };

  const handleAddToCart = () => {
    const cartItem: SingleCartItem = {
      _key: generateCartKey(content.name),
      fontID: fontID(),
      fullName: `${content.name} Custom`,
      license: "Both",
      users: [1, 4] as [number, number],
      family: content.name,
      weightName: "",
      weightValue: wght,
      widthName: "",
      widthValue: wdth,
      opticalSizeName: "",
      opticalSizeValue: opsz,
      slantName: "",
      slantValue: slnt,
      isItalic: italic,
      hasSerif: false,
      serifStyleValue: 0,
      has_MONO: false,
      monoStyleName: "",
      monoStyleValue: 0,
      has_STEN: false,
      stencilStyleName: "",
      stencilStyleValue: 0,
      price: 60,
    };
    addToCart(cartItem);
  };

  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center">
      <div className="relative w-full">
        <div
          style={{
            height: "60vh",
            transformOrigin: "center center",
          }}
          className="relative mx-auto w-full"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: backgroundType === "color" ? backgroundColor : undefined,
              backgroundImage:
                backgroundType === "image" && backgroundImage
                  ? `url(${backgroundImage})`
                  : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            id="blue-container-tester"
          />

          {showType && (
            <div className="pointer-events-none absolute inset-0 z-30 flex w-full place-items-center items-center justify-center p-8">
              <div className="relative w-full">
                <div
                  ref={editableRef}
                  id="editable-content"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  className="pointer-events-auto w-full cursor-text resize-none overflow-hidden border-0 whitespace-pre-wrap outline-none focus:ring-0"
                  style={{
                    color: textColor,
                    fontSize: "7vw",
                    lineHeight: lineHeight,
                    fontFamily: content.name,
                    fontStyle: italic ? "italic" : "normal",
                    textAlign: textAlign,
                    fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz}, 'slnt' ${slnt}`,
                    minHeight: "200px",
                  }}
                  lang="en"
                  spellCheck="false"
                >
                  {customText}
                </div>
              </div>
            </div>
          )}
        </div>
        <CartList
          customCartItems={customCartItems}
          removeFromCart={removeFromCart}
          handleAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
