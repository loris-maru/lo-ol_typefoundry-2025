"use client";

import { useState } from "react";

import { typeface } from "@/types/typefaces";
import ColumnSelector from "@/ui/segments/collection/playground/blocks/column-selector";
import defaultTexts from "@/ui/segments/collection/playground/CONTENT";

export default function OneColumnSection({ content }: { content: typeface }) {
  const [columnTypes, setColumnTypes] = useState<("text" | "image")[]>(["text"]);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([null]);

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
      <div className="grid grid-cols-1 gap-6">
        <ColumnSelector
          content={content}
          columns={1}
          columnIndex={0}
          defaultText={defaultTexts.one[0]}
          defaultFontSize={64}
          defaultWeight={900}
          defaultLineHeight={1.1}
          defaultWidth={900}
          defaultSlant={0}
          onColumnTypeChange={handleColumnTypeChange}
          onImageChange={handleImageChange}
          columnType={columnTypes[0]}
          imageUrl={imageUrls[0]}
        />
      </div>
    </div>
  );
}
