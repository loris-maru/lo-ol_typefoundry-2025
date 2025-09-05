import { useEffect, useRef, useState } from "react";

import { AxisSettings } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
import VariableSettings from "@/ui/segments/collection/character-set/variable-settings";
import { cn } from "@/utils/classNames";

import Variants from "./variants";

export default function CharacterViewer({
  activeCharacter,
  characterSet,
  content,
  axisSettings,
  onAxisSettingsChange,
  fontName,
  isInverted = false,
  onToggleInverted,
}: {
  activeCharacter: string;
  characterSet: CharacterSetProps[];
  setActiveCharacter: (character: string) => void;
  content: typeface;
  axisSettings: AxisSettings;
  onAxisSettingsChange: (settings: AxisSettings) => void;
  fontName: string;
  isInverted?: boolean;
  onToggleInverted?: () => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isMouseInside, setIsMouseInside] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [baselineOffset, setBaselineOffset] = useState<number>(50); // Default to 50% (center)
  const characterRef = useRef<HTMLDivElement>(null);

  // Reset selected variant when active character changes
  useEffect(() => {
    setSelectedVariant(null);
  }, [activeCharacter]);

  // Handle mouse movement for weight and secondary axis control
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseInside) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update mouse position for crosshair
    setMousePosition({ x, y });

    // Calculate percentages (0-100%)
    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Map Y position to weight (100-900)
    const newWeight = Math.round(100 + (yPercent / 100) * 800);

    // Determine secondary axis based on available axes
    let secondaryAxis = null;
    let newSecondaryValue = 0;

    if (content.has_opsz) {
      secondaryAxis = "opsz";
      newSecondaryValue = Math.round(100 + (xPercent / 100) * 800); // 100-900
    } else if (content.has_wdth) {
      secondaryAxis = "wdth";
      newSecondaryValue = Math.round(100 + (xPercent / 100) * 800); // 100-900
    } else if (content.has_slnt) {
      secondaryAxis = "slnt";
      newSecondaryValue = Math.round((xPercent / 100) * 90); // 0-90
    }

    // Update axis settings
    const newSettings = {
      ...axisSettings,
      wght: newWeight,
      ...(secondaryAxis && {
        [secondaryAxis]: newSecondaryValue,
      }),
    };

    onAxisSettingsChange(newSettings);
  };

  const handleMouseEnter = () => {
    setIsMouseInside(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
  };

  // Find the current character and its variants
  const currentCharacter = characterSet.find((char) => char.value === activeCharacter);
  const variants = currentCharacter?.variants ? Object.entries(currentCharacter.variants) : [];

  // Get the character to display (variant or original)
  const displayCharacter = selectedVariant || activeCharacter;

  const wght = axisSettings.wght;
  const wdth = content.has_wdth ? axisSettings.wdth : 900;
  const slnt = content.has_slnt ? axisSettings.slnt : 0;
  const opsz = content.has_opsz ? axisSettings.opsz : 900;

  // Measure the actual baseline of the character
  useEffect(() => {
    const measureBaseline = () => {
      if (!characterRef.current) return;

      // Create a temporary element to measure the character
      const tempElement = document.createElement("div");
      tempElement.style.fontFamily = fontName;
      tempElement.style.fontSize = "100px"; // Use large size for accurate measurement
      tempElement.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`;
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.whiteSpace = "nowrap";
      tempElement.textContent = displayCharacter;

      document.body.appendChild(tempElement);

      // Get the bounding box of the character
      const rect = tempElement.getBoundingClientRect();

      // Calculate the baseline position
      // The baseline is typically at the bottom of the character's bounding box
      // We need to account for the fact that the character is centered in the container
      const containerHeight = characterRef.current.offsetHeight;
      const characterHeight = rect.height;

      // The baseline is at the bottom of the character's bounding box
      // Since the character is centered, we need to calculate the offset from the center
      const baselineFromTop = (containerHeight - characterHeight) / 2 + characterHeight;
      const baselinePercentage = (baselineFromTop / containerHeight) * 100;

      setBaselineOffset(baselinePercentage);

      document.body.removeChild(tempElement);
    };

    if (fontName && displayCharacter) {
      // Use a small delay to ensure the character is rendered
      const timeoutId = setTimeout(measureBaseline, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [fontName, displayCharacter, wght, wdth, slnt, opsz]);

  return (
    <div className="relative flex h-full w-full flex-col gap-y-2 py-8 pl-8">
      {/* Color Toggle Switch */}
      {onToggleInverted && (
        <div className="absolute top-16 right-8 z-20 flex items-center gap-3">
          <span className={`font-whisper text-sm ${isInverted ? "text-black" : "text-white"}`}>
            {isInverted ? "Light" : "Dark"}
          </span>
          <button
            type="button"
            onClick={onToggleInverted}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isInverted ? "bg-black" : "bg-white"
            }`}
            aria-label="Toggle color inversion"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                isInverted ? "translate-x-6 bg-white" : "translate-x-1 bg-black"
              }`}
            />
          </button>
        </div>
      )}

      {/* Main Character Display */}
      <div
        className={cn(
          "relative flex h-[70vh] w-full flex-col justify-between rounded-2xl border border-solid transition-all duration-200",
          isInverted ? "border-neutral-300 bg-white" : "border-neutral-700 bg-transparent",
          isMouseInside ? "cursor-crosshair" : "cursor-default",
        )}
        id="character-viewer-box"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Crosshair lines */}
        {isMouseInside && (
          <>
            {/* Vertical line */}
            <div
              className={cn(
                "absolute z-20 h-full w-px",
                isInverted ? "bg-neutral-400" : "bg-neutral-500",
              )}
              style={{
                left: mousePosition.x,
                top: 0,
                transform: "translateX(-50%)",
              }}
            />
            {/* Horizontal line */}
            <div
              className={cn(
                "absolute z-20 h-px w-full",
                isInverted ? "bg-neutral-400" : "bg-neutral-500",
              )}
              style={{
                top: mousePosition.y,
                left: 0,
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}

        <div
          ref={characterRef}
          id="character-viewer"
          className={`relative flex h-[95%] w-full items-center justify-center rounded-lg text-[30vw] ${
            isInverted ? "text-black" : "text-white"
          }`}
          style={{
            fontFamily: fontName,
            fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
          }}
        >
          {/* Typography Metrics Lines */}
          <div className="pointer-events-none absolute inset-0">
            {/* Baseline */}
            <div
              className={cn("absolute h-px w-full", isInverted ? "bg-red-500" : "bg-red-400")}
              style={{
                top: `${baselineOffset}%`,
                transform: "translateY(-50%)",
              }}
            />

            {/* Ascender Line */}
            <div
              className={cn("absolute h-px w-full", isInverted ? "bg-blue-500" : "bg-blue-400")}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                marginTop: "-0.8em", // Approximate ascender height
              }}
            />

            {/* Cap Height */}
            <div
              className={cn("absolute h-px w-full", isInverted ? "bg-green-500" : "bg-green-400")}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                marginTop: "-0.7em", // Approximate cap height
              }}
            />

            {/* X-Height */}
            <div
              className={cn("absolute h-px w-full", isInverted ? "bg-yellow-500" : "bg-yellow-400")}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                marginTop: "-0.5em", // Approximate x-height
              }}
            />

            {/* Descender Line */}
            <div
              className={cn("absolute h-px w-full", isInverted ? "bg-purple-500" : "bg-purple-400")}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                marginTop: "0.2em", // Approximate descender depth
              }}
            />
          </div>

          {displayCharacter}
        </div>

        {/* Typography Metrics Legend */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", isInverted ? "bg-red-500" : "bg-red-400")} />
            <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("h-3 w-3 rounded-full", isInverted ? "bg-blue-500" : "bg-blue-400")}
            />
            <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Ascender</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("h-3 w-3 rounded-full", isInverted ? "bg-green-500" : "bg-green-400")}
            />
            <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>
              Cap Height
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("h-3 w-3 rounded-full", isInverted ? "bg-yellow-500" : "bg-yellow-400")}
            />
            <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>X-Height</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("h-3 w-3 rounded-full", isInverted ? "bg-purple-500" : "bg-purple-400")}
            />
            <span className={`text-xs ${isInverted ? "text-black" : "text-white"}`}>Descender</span>
          </div>
        </div>

        {/* Variants Container - Always present to maintain consistent height */}
        <div className="relative h-[15%] w-full px-12">
          {variants.length > 0 ? (
            <Variants
              activeCharacter={activeCharacter}
              variants={variants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              fontName={fontName}
              axisSettings={axisSettings}
              content={content}
              isInverted={isInverted}
            />
          ) : (
            <div className="flex h-full w-full">
              <span
                className={`font-whisper text-sm ${
                  isInverted ? "text-neutral-500" : "text-neutral-500"
                }`}
              >
                No variants available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Variable Settings */}
      <div className="relative mt-5 h-1/4 w-full rounded-2xl">
        <VariableSettings
          content={content}
          axisSettings={axisSettings}
          onAxisSettingsChange={onAxisSettingsChange}
          isInverted={isInverted}
        />
      </div>
    </div>
  );
}
