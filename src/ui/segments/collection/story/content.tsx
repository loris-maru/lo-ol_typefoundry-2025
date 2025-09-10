"use client";

import { useState, useEffect } from "react";
import { typeface } from "@/types/typefaces";
import FontList from "@/ui/segments/collection/story/font-list";
import Introduction from "@/ui/segments/collection/story/introduction";
import slugify from "@/utils/slugify";

export default function StoryContent({
  content,
  uprightFontUrl,
  italicFontUrl,
}: {
  content: typeface;
  uprightFontUrl: string;
  italicFontUrl: string;
}) {
  const [mouseX, setMouseX] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(100);
  const [isItalic, setIsItalic] = useState(false);

  // Calculate weight based on mouse X position (100 at left edge, 900 at right edge)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const windowWidth = window.innerWidth;
      const normalizedX = x / windowWidth; // 0 to 1
      const weight = Math.round(100 + normalizedX * 800); // 100 to 900
      setMouseX(x);
      setCurrentWeight(weight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Early return after all hooks to prevent hook order issues
  if (!content) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col justify-between bg-black p-8 text-white">
      <Introduction
        content={content}
        familyName={slugify(content.name)}
        currentWeight={currentWeight}
        isItalic={isItalic}
        hasItalic={content.has_italic}
        onItalicToggle={() => setIsItalic(!isItalic)}
        uprightFontUrl={uprightFontUrl}
        italicFontUrl={italicFontUrl}
      />
      <FontList singleFontList={content.singleFontList} currentWeight={currentWeight} />
    </div>
  );
}
