"use client";

import { useState } from "react";
import { typeface } from "@/types/typefaces";
import TypeTesterBlock from "@/ui/segments/collection/playground/type-tester-block";
import ImageColumn from "./image-column";

interface ColumnSelectorProps {
  content: typeface;
  columns: 1 | 2 | 3;
  columnIndex: number;
  defaultText: string;
  defaultFontSize: number;
  defaultWeight: number;
  defaultLineHeight: number;
  defaultWidth: number;
  defaultSlant: number;
  onColumnTypeChange: (columnIndex: number, type: "text" | "image") => void;
  onImageChange: (columnIndex: number, imageUrl: string | null) => void;
  columnType: "text" | "image";
  imageUrl?: string | null;
}

export default function ColumnSelector({
  content,
  columns,
  columnIndex,
  defaultText,
  defaultFontSize,
  defaultWeight,
  defaultLineHeight,
  defaultWidth,
  defaultSlant,
  onColumnTypeChange,
  onImageChange,
  columnType,
  imageUrl,
}: ColumnSelectorProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleTypeChange = (type: "text" | "image") => {
    onColumnTypeChange(columnIndex, type);
    setShowTypeSelector(false);
  };

  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return "col-span-1";
      case 2:
        return "col-span-1";
      case 3:
        return "col-span-1";
      default:
        return "col-span-1";
    }
  };

  return (
    <div className={`${getColumnClass()} relative`}>
      {/* Type selector button */}
      <div className="absolute top-2 right-2 z-10">
        {/* <button
          onClick={() => setShowTypeSelector(!showTypeSelector)}
          className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          {columnType === "text" ? "📝 Text" : "🖼️ Image"}
        </button> */}

        {showTypeSelector && (
          <div className="absolute top-8 right-0 z-20 rounded border border-gray-300 bg-white py-1 shadow-lg">
            <button
              onClick={() => handleTypeChange("text")}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              📝 Text Column
            </button>
            <button
              onClick={() => handleTypeChange("image")}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              🖼️ Image Column
            </button>
          </div>
        )}
      </div>

      {/* Column content */}
      {columnType === "text" ? (
        <TypeTesterBlock
          defaultFontSize={defaultFontSize}
          defaultWeight={defaultWeight}
          defaultLineHeight={defaultLineHeight}
          defaultWidth={defaultWidth}
          defaultSlant={defaultSlant}
          defaultText={defaultText}
          columns={columns}
          content={content}
        />
      ) : (
        <ImageColumn
          onImageChange={(imageUrl) => onImageChange(columnIndex, imageUrl)}
          imageUrl={imageUrl}
          columns={columns}
        />
      )}
    </div>
  );
}
