"use client";

import { useState } from "react";
import { typeface } from "@/types/typefaces";
import ColumnSelector from "./column-selector";

export default function ThreeColumnSection({ content }: { content: typeface }) {
  const [columnTypes, setColumnTypes] = useState<("text" | "image")[]>(["text", "text", "text"]);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([null, null, null]);

  const text1 =
    "The Eiger village of Grindelwald in the Bernese Oberland lies embedded in a welcoming and green hollow, surrounded by a commanding mountainscape with the Eiger north face and the Wetterhorn. This mountainscape and the numerous lookout points and activities make Grindelwald one of the most popular and cosmopolitan holiday and excursion destinations in Switzerland, and the largest ski resort in the Jungfrau region.";
  const text2 =
    "The symbol of the «world's smallest metropolis» is the \"Jet d'eau\" – a fountain with a 140-metre-high water jet at the periphery of Lake Geneva. Most of the large hotels and many restaurants are situated on the right-hand shore of the lake. The old town, the heart of Geneva with the shopping and business quarter, holds sway over the left-hand shore.";
  const text3 =
    'The Matterhorn and Switzerland are inseparably linked to each other. The pyramid shaped colossus of a mountain, which is very difficult to climb, is said to be the most-photographed mountain in the world. The Klein-Matterhorn ("Little Matterhorn"), which can be reached via a funicular, lies adjacent to the Matterhorn.';

  const handleColumnTypeChange = (columnIndex: number, type: "text" | "image") => {
    setColumnTypes((prev) => {
      const newTypes = [...prev];
      newTypes[columnIndex] = type;
      return newTypes;
    });
  };

  const handleImageChange = (columnIndex: number, imageUrl: string | null) => {
    setImageUrls((prev) => {
      const newUrls = [...prev];
      newUrls[columnIndex] = imageUrl;
      return newUrls;
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-6">
        <ColumnSelector
          content={content}
          columns={3}
          columnIndex={0}
          defaultText={text1}
          defaultFontSize={20}
          defaultWeight={400}
          defaultLineHeight={1.4}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[0]}
          imageUrl={imageUrls[0]}
        />
        <ColumnSelector
          content={content}
          columns={3}
          columnIndex={1}
          defaultText={text2}
          defaultFontSize={20}
          defaultWeight={400}
          defaultLineHeight={1.4}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[1]}
          imageUrl={imageUrls[1]}
        />
        <ColumnSelector
          content={content}
          columns={3}
          columnIndex={2}
          defaultText={text3}
          defaultFontSize={20}
          defaultWeight={400}
          defaultLineHeight={1.4}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[2]}
          imageUrl={imageUrls[2]}
        />
      </div>
    </div>
  );
}
