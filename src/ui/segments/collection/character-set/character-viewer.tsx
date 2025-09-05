import { useEffect, useState } from "react";

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
        <div
          id="character-viewer"
          className={`relative flex h-[85%] w-full items-center justify-center rounded-lg text-[30vw] ${
            isInverted ? "text-black" : "text-white"
          }`}
          style={{
            fontFamily: fontName,
            fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
          }}
        >
          {displayCharacter}
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
        />
      </div>
    </div>
  );
}
