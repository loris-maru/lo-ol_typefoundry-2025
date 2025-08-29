"use client";

import { singleFont, typeface } from "@/types/typefaces";
import SingleFontItem from "./item";

export default function Shop({ content }: { content: typeface }) {
  console.log("Content is: ", content.singleFontList);

  return (
    <div className="relative w-full h-full">
      <h1 className="text-6xl font-medium font-whisper">Shop</h1>
      <div className="flex flex-col">
        {content.singleFontList.map((font: singleFont) => (
          <SingleFontItem
            key={font._key}
            familyName={content.name}
            content={font}
          />
        ))}
      </div>
    </div>
  );
}
