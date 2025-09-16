"use client";

import { useState, useRef } from "react";

import { MotionValue, useMotionValueEvent } from "motion/react";
import { RiAlignLeft, RiAlignCenter, RiAlignRight } from "react-icons/ri";

import { typeface } from "@/types/typefaces";
import AddToCart from "@/ui/segments/collection/custom/add-to-cart";
import CustomFontSettings from "@/ui/segments/collection/custom/custom-font-settings";
import InputTextColor from "@/ui/segments/collection/custom/input-text-color";
import InputBackground from "@/ui/segments/collection/custom/inputs-background";
import { cn } from "@/utils/classNames";

interface TypeTesterCustomiseProps {
  content: typeface;
  height: MotionValue<string>;
}

export default function TypeTesterCustomise({ content, height }: TypeTesterCustomiseProps) {
  // Design
  const [textColor, setTextColor] = useState<string>("#000000");
  const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
  const [backgroundColor, setBackgroundColor] = useState<string>("#A8E2FB");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  // const [fontSize, setFontSize] = useState<number>(120);
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
  };

  const handleFocus = () => {
    // Handle focus event
  };

  const handleBlur = () => {
    // Handle blur event
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key to create new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  const handleClick = () => {
    // Handle click event
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
          onMouseDown={(e) => {
            console.log("Div mouse down:", e.target);
          }}
        >
          <div
            className={cn(
              "pointer-events-none relative z-20 flex h-full w-full flex-col justify-between p-6",
              backgroundType === "image" && "border border-solid border-black",
            )}
          >
            <div
              id="global-settings-container"
              className="font-whisper pointer-events-auto relative flex w-full flex-row items-start justify-between text-sm tracking-wider uppercase"
            >
              <InputTextColor value={textColor} onChange={setTextColor} />

              {/* Text Alignment Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTextAlign("left")}
                  className={`rounded p-2 transition-colors duration-200 ${
                    textAlign === "left"
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-gray-100"
                  }`}
                  aria-label="Align text left"
                >
                  <RiAlignLeft size={16} />
                </button>
                <button
                  onClick={() => setTextAlign("center")}
                  className={`rounded p-2 transition-colors duration-200 ${
                    textAlign === "center"
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-gray-100"
                  }`}
                  aria-label="Align text center"
                >
                  <RiAlignCenter size={16} />
                </button>
                <button
                  onClick={() => setTextAlign("right")}
                  className={`rounded p-2 transition-colors duration-200 ${
                    textAlign === "right"
                      ? "bg-black text-white"
                      : "bg-transparent text-black hover:bg-gray-100"
                  }`}
                  aria-label="Align text right"
                >
                  <RiAlignRight size={16} />
                </button>
              </div>

              <InputBackground
                type={backgroundType}
                colorValue={backgroundColor}
                textColor={textColor}
                backgroundImageValue={backgroundImage}
                onTypeChange={setBackgroundType}
                onColorChange={setBackgroundColor}
                onImageChange={setBackgroundImage}
              />
            </div>
            <div className="pointer-events-auto">
              <CustomFontSettings
                // fontSize={{ value: fontSize, setValue: setFontSize }}
                lineHeight={{ value: lineHeight, setValue: setLineHeight }}
                weight={{ value: wght, setValue: setWght }}
                width={{ value: wdth, setValue: setWdth }}
                slant={{ value: slnt, setValue: setSlnt }}
                italic={{ value: italic, setValue: setItalic }}
                opticalSize={{ value: opsz, setValue: setOpsz }}
                textColor={textColor}
                content={content}
              />
            </div>
          </div>

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
            <div className="absolute inset-0 z-30 flex w-full place-items-center items-center justify-center p-8">
              <div className="relative w-full">
                <div
                  ref={editableRef}
                  id="editable-content"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  onClick={handleClick}
                  className="w-full cursor-text resize-none overflow-hidden border-0 whitespace-pre-wrap outline-none focus:ring-0"
                  style={{
                    color: textColor,
                    fontSize: "7vw",
                    lineHeight: "1.35",
                    fontFamily: content.name,
                    fontStyle: italic ? "italic" : "normal",
                    textAlign: textAlign,
                    fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'opsz' ${opsz}, 'slnt' ${slnt}`,
                    minHeight: "200px",
                  }}
                >
                  {customText}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative flex w-full flex-row items-center justify-end gap-x-4 pt-6">
          <div className="font-whisper text-base font-medium">CHF 60</div>
          <AddToCart />
        </div>
      </div>
    </div>
  );
}
