import { useEffect, useState } from "react";

import { AxisSettings } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
import VariableSettings from "@/ui/segments/collection/character-set/variable-settings";

import Variants from "./variants";

export default function CharacterViewer({
  activeCharacter,
  characterSet,
  content,
  axisSettings,
  onAxisSettingsChange,
  fontName,
}: {
  activeCharacter: string;
  characterSet: CharacterSetProps[];
  setActiveCharacter: (character: string) => void;
  content: typeface;
  axisSettings: AxisSettings;
  onAxisSettingsChange: (settings: AxisSettings) => void;
  fontName: string;
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Reset selected variant when active character changes
  useEffect(() => {
    setSelectedVariant(null);
  }, [activeCharacter]);

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
      {/* Main Character Display */}
      <div className="relative flex h-[70vh] w-full flex-col justify-between rounded-2xl border border-solid border-neutral-700">
        <div
          id="character-viewer"
          className="relative flex h-[85%] w-full items-center justify-center rounded-lg text-[30vw] text-white"
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
            />
          ) : (
            <div className="flex h-full w-full">
              <span className="font-whisper text-sm text-neutral-500">No variants available</span>
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
