"use client";

import { useState } from "react";

import { motion, MotionValue, useMotionValueEvent } from "motion/react";
import { Typewriter } from "motion-plus-react";

import { typeface } from "@/types/typefaces";
import InputTextColor from "@/ui/segments/collection/custom/input-text-color";
import InputBackground from "@/ui/segments/collection/custom/inputs-background";

interface TypeTesterCustomiseProps {
  content: typeface;
  height: MotionValue<string>;
}

export default function TypeTesterCustomise({ content, height }: TypeTesterCustomiseProps) {
  const PHRASE = `Customize ${content.name}`;

  const [textColor, setTextColor] = useState<string>("#000000");
  const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
  const [backgroundColor, setBackgroundColor] = useState<string>("#A8E2FB");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [showType, setShowType] = useState(false);

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

  return (
    <div className="relative flex min-h-[80vh] w-full items-center justify-center">
      {/* This wrapper uses the height prop from parent for animation */}
      <div className="relative w-full">
        <motion.div
          style={{
            height,
            transformOrigin: "center center", // grow from vertical center
          }}
          className="relative mx-auto w-full"
        >
          <div className="relative z-20 flex h-full w-full flex-col justify-between border border-solid border-black p-6">
            <div className="font-whisper relative flex w-full flex-row items-start justify-between text-sm tracking-wider uppercase">
              <InputTextColor value={textColor} onChange={setTextColor} />
              <InputBackground
                type={backgroundType}
                colorValue={backgroundColor}
                backgroundImageValue={backgroundImage}
                onTypeChange={setBackgroundType}
                onColorChange={setBackgroundColor}
                onImageChange={setBackgroundImage}
              />
            </div>
          </div>
          <div
            className="absolute inset-0"
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
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center p-8">
              <Typewriter
                as="p"
                className="block text-center text-[8vw] leading-[1.1]"
                style={{
                  fontFamily: content.name,
                  fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
                }}
              >
                {PHRASE}
              </Typewriter>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
