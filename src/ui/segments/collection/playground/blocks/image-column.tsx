"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageColumnProps {
  onImageChange: (imageUrl: string | null) => void;
  imageUrl?: string | null;
  columns: 1 | 2 | 3;
}

export default function ImageColumn({ onImageChange, imageUrl, columns }: ImageColumnProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange],
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemoveImage = () => {
    onImageChange(null);
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
    <div className={getColumnClass()}>
      {imageUrl ? (
        <div className="group relative">
          <img
            src={imageUrl}
            alt="Uploaded content"
            className="h-auto w-full rounded-lg object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors duration-200 ${
            isDragActive && !isDragReject
              ? "border-gray-400 bg-blue-50"
              : isDragReject
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
          } `}
        >
          <input {...getInputProps()} />
          <div className="font-whisper text-center">
            <svg
              className="mx-auto mb-2 h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? "Drop the image here" : "Drop your image here"}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>or click to select a file</p>
              <p className="mt-1">PNG, JPG, GIF, WebP, SVG up to 10MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
