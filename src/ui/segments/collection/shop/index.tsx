"use client";

import { FontSettings, singleFont, typeface } from "@/types/typefaces";
import SingleFontItem from "@/ui/segments/collection/shop/item";

export default function Shop({ content }: { content: typeface }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="font-whisper mb-8 text-xl font-medium tracking-widest uppercase">Shop</h1>
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-6">
          {content.singleFontList.map((font: singleFont) => {
            const fontSettings: FontSettings = {
              hasOpticalSize: font.hasOpticalSize,
              hasSlant: font.hasSlant,
              hasWidth: font.hasWidth,
              isItalic: font.isItalic,
            };
            return (
              <SingleFontItem
                key={font._key}
                content={font}
                settings={fontSettings}
                familyName={content.name}
                price={content.pricePerFont}
              />
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </div>
  );
}
