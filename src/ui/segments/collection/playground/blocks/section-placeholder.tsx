"use client";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { typeface } from "@/types/typefaces";
import TypeTesterBlock from "@/ui/segments/collection/playground/type-tester-block";
import ImageColumn from "./image-column";

interface SectionPlaceholderProps {
  content: typeface;
  columns: 1 | 2 | 3;
  sectionId: number;
  onSectionTypeChange: (sectionId: number, columnIndex: number, type: "text" | "image") => void;
  onImageChange: (sectionId: number, columnIndex: number, imageUrl: string | null) => void;
  onDeleteSection: (sectionId: number) => void;
  columnTypes: ("text" | "image")[];
  imageUrls: (string | null)[];
  defaultTexts: string[];
  defaultFontSizes: number[];
  defaultWeights: number[];
  defaultLineHeights: number[];
  defaultWidths: number[];
  defaultSlants: number[];
}

export default function SectionPlaceholder({
  content,
  columns,
  sectionId,
  onSectionTypeChange,
  onImageChange,
  onDeleteSection,
  columnTypes,
  imageUrls,
  defaultTexts,
  defaultFontSizes,
  defaultWeights,
  defaultLineHeights,
  defaultWidths,
  defaultSlants,
}: SectionPlaceholderProps) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  const renderColumn = (columnIndex: number) => {
    const columnType = columnTypes[columnIndex];
    const imageUrl = imageUrls[columnIndex];
    const defaultText = defaultTexts[columnIndex];
    const defaultFontSize = defaultFontSizes[columnIndex];
    const defaultWeight = defaultWeights[columnIndex];
    const defaultLineHeight = defaultLineHeights[columnIndex];
    const defaultWidth = defaultWidths[columnIndex];
    const defaultSlant = defaultSlants[columnIndex];

    if (columnType === "text") {
      return (
        <TypeTesterBlock
          key={columnIndex}
          defaultFontSize={defaultFontSize}
          defaultWeight={defaultWeight}
          defaultLineHeight={defaultLineHeight}
          defaultWidth={defaultWidth}
          defaultSlant={defaultSlant}
          defaultText={defaultText}
          columns={columns}
          content={content}
        />
      );
    } else if (columnType === "image") {
      return (
        <ImageColumn
          key={columnIndex}
          onImageChange={(imageUrl) => onImageChange(sectionId, columnIndex, imageUrl)}
          imageUrl={imageUrl}
          columns={columns}
        />
      );
    }

    // Placeholder state - show choice buttons
    return (
      <div
        key={columnIndex}
        className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-gray-300 bg-transparent p-6"
      >
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">Choose content type for this column</p>
          <div className="flex gap-3">
            <button
              onClick={() => onSectionTypeChange(sectionId, columnIndex, "text")}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
            >
              📝 Use Text
            </button>
            <button
              onClick={() => onSectionTypeChange(sectionId, columnIndex, "image")}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600"
            >
              🖼️ Use Image
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      {/* Delete button - only show on hover */}
      {showDeleteButton && (
        <button
          onClick={() => onDeleteSection(sectionId)}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow-lg transition-colors duration-200 hover:bg-red-600"
          aria-label="Delete section"
        >
          <RiDeleteBin6Line className="h-4 w-4" />
        </button>
      )}

      {/* Section content */}
      <div className={`grid ${getColumnClass()} gap-6`}>
        {Array.from({ length: columns }, (_, index) => renderColumn(index))}
      </div>
    </div>
  );
}
