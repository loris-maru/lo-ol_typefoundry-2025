"use client";

import { useState, useRef, useCallback } from "react";

import Image from "next/image";

import { cn } from "@/utils/classNames";

interface InputBackgroundProps {
  type: "color" | "image";
  colorValue: string;
  backgroundImageValue: string | null;
  onTypeChange: (type: "color" | "image") => void;
  onColorChange: (color: string) => void;
  onImageChange: (image: string | null) => void;
}

export default function InputBackground({
  type,
  colorValue,
  backgroundImageValue,
  onTypeChange,
  onColorChange,
  onImageChange,
}: InputBackgroundProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          onImageChange(result);
        };
        reader.readAsDataURL(imageFile);
      }
    },
    [onImageChange],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          onImageChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange],
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="font-whisper flex flex-col items-end gap-3 text-sm text-black">
      <div className="flex flex-row items-center">
        <div className="mr-2 block">Background</div>
        <div className="flex flex-row items-center gap-x-px border border-solid border-black p-2">
          <button
            type="button"
            name="background-color-button"
            aria-label="Select color background mode"
            onClick={() => onTypeChange("color")}
            className="font-whisper text-base tracking-wide uppercase"
          >
            Color
          </button>

          {/* Toggle Switch */}
          <div className="relative mx-2">
            <button
              type="button"
              name="background-type-toggle"
              aria-label={`Switch to ${type === "color" ? "image" : "color"} background mode`}
              onClick={() => onTypeChange(type === "color" ? "image" : "color")}
              className="relative flex h-8 w-14 items-center rounded-sm border border-solid border-black bg-transparent"
            >
              <span
                className={cn(
                  "inline-block h-6 w-6 transform rounded-sm bg-black transition-transform",
                  type === "image" ? "translate-x-[26px]" : "translate-x-[3px]",
                )}
              />
            </button>
          </div>

          <button
            type="button"
            name="background-image-button"
            aria-label="Select image background mode"
            onClick={() => onTypeChange("image")}
            className="font-whisper text-base tracking-wide uppercase"
          >
            Image
          </button>
        </div>
      </div>

      {/* Color Selection */}
      {type === "color" && (
        <div className="flex w-full flex-row items-center gap-3 pl-[104px]">
          <span className="block">{colorValue}</span>
          <input
            type="color"
            name="background-color-picker"
            aria-label="Choose background color"
            value={colorValue}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-8 w-full cursor-pointer rounded-sm border border-solid border-black"
          />
        </div>
      )}

      {/* Image Selection */}
      {type === "image" && (
        <div className="w-full pl-[104px]">
          <div
            className={cn(
              "relative flex h-20 w-full cursor-pointer items-center justify-center border-2 border-dashed p-6 transition-colors",
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            )}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            aria-label="Upload background image by clicking or dragging and dropping"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="background-image-upload"
              aria-label="Upload background image file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {backgroundImageValue ? (
              <div className="relative h-full w-full">
                <Image
                  src={backgroundImageValue}
                  alt="Background preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  name="remove-background-image"
                  aria-label="Remove background image"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(null);
                  }}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-red-500 text-white hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-xs text-gray-500">
                  {isDragOver ? "Drop image here" : "Click or drag image here"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
