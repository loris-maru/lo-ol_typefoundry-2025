import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TypefaceSettings } from "@/types/playground";

export default function SettingMenu({
  settings,
  onClose,
  textColor,
  setTextColor,
  backgroundColor,
  setBackgroundColor,
  backgroundType,
  setBackgroundType,
  backgroundImage,
  setBackgroundImage,
  paddingTop,
  setPaddingTop,
  paddingRight,
  setPaddingRight,
  paddingBottom,
  setPaddingBottom,
  paddingLeft,
  setPaddingLeft,
}: {
  settings: TypefaceSettings;
  onClose?: () => void;
  textColor?: string;
  setTextColor?: (color: string) => void;
  backgroundColor?: string;
  setBackgroundColor?: (color: string) => void;
  backgroundType?: "transparent" | "color" | "image";
  setBackgroundType?: (type: "transparent" | "color" | "image") => void;
  backgroundImage?: string | null;
  setBackgroundImage?: (image: string | null) => void;
  paddingTop?: number;
  setPaddingTop?: (value: number) => void;
  paddingRight?: number;
  setPaddingRight?: (value: number) => void;
  paddingBottom?: number;
  setPaddingBottom?: (value: number) => void;
  paddingLeft?: number;
  setPaddingLeft?: (value: number) => void;
}) {
  const { lh, setLh } = settings;
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && setBackgroundImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setBackgroundImage(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [setBackgroundImage],
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleRemoveImage = () => {
    if (setBackgroundImage) {
      setBackgroundImage(null);
    }
  };

  return (
    <div className="absolute right-0 z-30 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close settings menu"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <div className="space-y-3 text-sm font-normal">
        <div className="mb-2 text-xs font-medium tracking-wider text-gray-600 uppercase">
          Block Settings
        </div>
        <label className="block">
          <span className="font-whisper mb-1 block">Line Height ({lh})</span>
          <input
            type="range"
            min={0.8}
            max={2.5}
            step={0.1}
            value={lh}
            onChange={(e) => setLh(+e.target.value)}
            className="w-full"
          />
        </label>

        {/* Background Type Selection */}
        {setBackgroundType && (
          <div className="block">
            <span className="font-whisper mb-2 block">Background Type</span>
            <div className="space-y-3 rounded-xl border border-solid border-neutral-300 p-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="backgroundType"
                  value="transparent"
                  checked={backgroundType === "transparent"}
                  onChange={(e) => setBackgroundType(e.target.value as "transparent")}
                  className="text-blue-600"
                />
                <span className="font-whisper text-sm">Transparent</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="backgroundType"
                    value="color"
                    checked={backgroundType === "color"}
                    onChange={(e) => setBackgroundType(e.target.value as "color")}
                    className="text-blue-600"
                  />
                  <span className="font-whisper text-sm">Color</span>
                </label>
                {backgroundType === "color" && setBackgroundColor && (
                  <div className="ml-6">
                    <input
                      type="color"
                      value={backgroundColor || "#ffffff"}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-8 w-full rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="backgroundType"
                    value="image"
                    checked={backgroundType === "image"}
                    onChange={(e) => setBackgroundType(e.target.value as "image")}
                    className="text-blue-600"
                  />
                  <span className="font-whisper text-sm">Image</span>
                </label>
                {backgroundType === "image" && setBackgroundImage && (
                  <div className="ml-6">
                    {backgroundImage ? (
                      <div className="group relative">
                        <img
                          src={backgroundImage}
                          alt="Background preview"
                          className="h-20 w-full rounded border border-gray-300 object-cover"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          aria-label="Remove background image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div
                        {...getRootProps()}
                        className={`flex min-h-[80px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-3 transition-colors duration-200 ${
                          isDragActive && !isDragReject
                            ? "border-gray-400 bg-blue-50"
                            : isDragReject
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <div className="font-whisper text-center">
                          <svg
                            className="mx-auto mb-1 h-8 w-8 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm font-medium text-gray-700">
                            {isDragActive ? "Drop the image here" : "Drop your image here"}
                          </p>
                          <div className="mt-1 text-xs text-gray-500">
                            <p>or click to select a file</p>
                            <p className="mt-0.5">PNG, JPG, GIF, WebP, SVG up to 10MB</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {setTextColor && (
          <label className="block">
            <span className="font-whisper mb-1 block">Text Color</span>
            <input
              type="color"
              value={textColor || "#000000"}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-full rounded border border-gray-300"
            />
          </label>
        )}
        {setPaddingTop && (
          <label className="block">
            <span className="font-whisper mb-1 block">Padding Top ({paddingTop}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingTop || 0}
              onChange={(e) => setPaddingTop(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingRight && (
          <label className="block">
            <span className="font-whisper mb-1 block">Padding Right ({paddingRight}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingRight || 0}
              onChange={(e) => setPaddingRight(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingBottom && (
          <label className="block">
            <span className="font-whisper mb-1 block">Padding Bottom ({paddingBottom}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingBottom || 0}
              onChange={(e) => setPaddingBottom(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
        {setPaddingLeft && (
          <label className="block">
            <span className="font-whisper mb-1 block">Padding Left ({paddingLeft}px)</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={paddingLeft || 0}
              onChange={(e) => setPaddingLeft(+e.target.value)}
              className="w-full"
            />
          </label>
        )}
      </div>
    </div>
  );
}
