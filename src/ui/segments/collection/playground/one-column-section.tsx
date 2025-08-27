"use client";

import { typeface } from "@/types/typefaces";
import TypeTesterBlock from "./type-tester-block";

export default function OneColumnSection({ content }: { content: typeface }) {
  const text =
    "Our goal is to connect both typographic cultures and share our knowledge of calligraphy, sketching, exploration and type design.";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6">
        <TypeTesterBlock
          defaultFontSize={64}
          defaultWeight={900}
          defaultLineHeight={1.1}
          defaultWidth={900}
          defaultSlant={0}
          defaultText={text}
          columns={1}
          content={content}
        />
      </div>
    </div>
  );
}
