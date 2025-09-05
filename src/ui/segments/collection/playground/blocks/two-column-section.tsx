"use client";

import { typeface } from "@/types/typefaces";
import TypeTesterBlock from "@/ui/segments/collection/playground/type-tester-block";

export default function TwoColumnSection({ content }: { content: typeface }) {
  const text1 =
    "Typefaces and the technologies used to bring them to life on screen are already incredibly advanced and have been mastered by many designers...";
  const text2 =
    "We hope that our website gives you a glimpse of a future where type design fully embraces digital. Of course, this is just the beginning...";

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        <TypeTesterBlock
          defaultFontSize={30}
          defaultWeight={500}
          defaultLineHeight={1.25}
          defaultWidth={900}
          defaultSlant={0}
          defaultText={text1}
          columns={2}
          content={content}
        />
        <TypeTesterBlock
          defaultFontSize={30}
          defaultWeight={500}
          defaultLineHeight={1.25}
          defaultWidth={900}
          defaultSlant={0}
          defaultText={text2}
          columns={2}
          content={content}
        />
      </div>
    </div>
  );
}
