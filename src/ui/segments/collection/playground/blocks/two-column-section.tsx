"use client";

import { useState } from "react";
import { typeface } from "@/types/typefaces";
import ColumnSelector from "./column-selector";

export default function TwoColumnSection({ content }: { content: typeface }) {
  const [columnTypes, setColumnTypes] = useState<("text" | "image")[]>(["text", "text"]);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([null, null]);

  const text1 =
    "Typefaces and the technologies used to bring them to life on screen are already incredibly advanced and have been mastered by many designers...";
  const text2 =
    "We hope that our website gives you a glimpse of a future where type design fully embraces digital. Of course, this is just the beginning...";

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
      <div className="grid grid-cols-2 gap-6">
        <ColumnSelector
          content={content}
          columns={2}
          columnIndex={0}
          defaultText={text1}
          defaultFontSize={30}
          defaultWeight={500}
          defaultLineHeight={1.25}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[0]}
          imageUrl={imageUrls[0]}
        />
        <ColumnSelector
          content={content}
          columns={2}
          columnIndex={1}
          defaultText={text2}
          defaultFontSize={30}
          defaultWeight={500}
          defaultLineHeight={1.25}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[1]}
          imageUrl={imageUrls[1]}
        />
      </div>
    </div>
  );
}
