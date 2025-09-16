"use client";

import { useState, useRef, useEffect } from "react";

import { MotionValue, useMotionValueEvent, useInView, animate } from "motion/react";

import { useCartStore, SingleCartItem } from "@/states/cart";
import { typeface } from "@/types/typefaces";
import CartList from "@/ui/segments/collection/custom/cart-list";
import GlobalSettings from "@/ui/segments/collection/custom/global-settings";
import { cn } from "@/utils/classNames";
import { generateCartKey } from "@/utils/generateCartKey";

type TypeTesterCustomiseProps = {
  content: typeface;
  height: MotionValue<string>;
};

export default function TypeTesterCustomise({ content, height }: TypeTesterCustomiseProps) {
  // Design
  const [textColor, setTextColor] = useState<string>("#000000");
  const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
  const [backgroundColor, setBackgroundColor] = useState<string>("#A8E2FB");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [lineHeight, setLineHeight] = useState<number>(1.3);
  const [customText, setCustomText] = useState<string>(`Customize ${content.name}`);

  // Font Variation Settings
  const [wght, setWght] = useState<number>(100);
  const [wdth, setWdth] = useState<number>(100);
  const [slnt, setSlnt] = useState<number>(0);
  const [opsz, setOpsz] = useState<number>(900);
  const [italic, setItalic] = useState<boolean>(false);

  const [showType, setShowType] = useState(false);

  // Animation states
  const [blueContainerHeight, setBlueContainerHeight] = useState(0);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showCartList, setShowCartList] = useState(false);

  // Cart
  const { addToCart, removeFromCart, cart } = useCartStore();

  // Filter cart items for this specific font family
  const customCartItems = cart.filter((item) => item.family === content.name);

  // Ref for the editable content
  const editableRef = useRef<HTMLDivElement>(null);

  // Ref for the container to detect viewport entry
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect when container enters 80% of viewport
  const isInView = useInView(containerRef, {
    amount: 0.8,
    once: false,
  });

  // Handle animation sequence
  useEffect(() => {
    if (isInView) {
      // Step 2: Expand blue container to 60vh
      animate(blueContainerHeight, 60, {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        onUpdate: (value) => setBlueContainerHeight(value),
        onComplete: () => {
          // Step 3: After 300ms, fade in GlobalSettings
          setTimeout(() => {
            setShowGlobalSettings(true);
            // Step 4: After another 300ms, fade in CartList
            setTimeout(() => {
              setShowCartList(true);
            }, 500);
          }, 500);
        },
      });
    } else {
      // Reset when out of view
      setBlueContainerHeight(0);
      setShowGlobalSettings(false);
      setShowCartList(false);
    }
  }, [isInView, blueContainerHeight]);

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
    <div className="relative flex h-full w-full flex-col items-end pt-[40vh]">
      <div
        ref={containerRef}
        style={{
          height: `${blueContainerHeight}vh`,
          transformOrigin: "center center",
        }}
        className="relative mx-auto w-full"
      >
        <div
          className={cn(
            "pointer-events-none relative z-20 flex h-full w-full flex-col justify-between p-6",
            backgroundType === "image" && "border border-solid border-black",
          )}
        >
          {showGlobalSettings && (
            <div
              style={{
                opacity: showGlobalSettings ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              <GlobalSettings
                content={content}
                text={{
                  color: textColor,
                  align: textAlign,
                  setColor: setTextColor,
                  setAlign: setTextAlign,
                }}
                background={{
                  type: backgroundType,
                  color: backgroundColor || "",
                  image: backgroundImage || "",
                  setType: setBackgroundType,
                  setColor: setBackgroundColor,
                  setImage: setBackgroundImage,
                }}
                font={{
                  lineHeight: { value: lineHeight, setValue: setLineHeight },
                  weight: { value: wght, setValue: setWght },
                  width: { value: wdth, setValue: setWdth },
                  slant: { value: slnt, setValue: setSlnt },
                  italic: { value: italic, setValue: setItalic },
                  opticalSize: { value: opsz, setValue: setOpsz },
                }}
              />
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: backgroundType === "color" ? backgroundColor : undefined,
            backgroundImage:
              backgroundType === "image" && backgroundImage ? `url(${backgroundImage})` : undefined,
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
      {showCartList && (
        <div
          style={{
            opacity: showCartList ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <CartList
            customCartItems={customCartItems}
            removeFromCart={removeFromCart}
            handleAddToCart={handleAddToCart}
          />
        </div>
      )}
    </div>
  );
}
