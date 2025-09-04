import { useEffect, useState } from "react";

import { useFont } from "@react-hooks-library/core";

import { AxisSettingsProps } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
import VariableSettings from "@/ui/segments/collection/character-set/variable-settings";
import slugify from "@/utils/slugify";

import Variants from "./variants";

export default function CharacterViewer({
  uprightFontFile,
  italicFontFile,
  activeCharacter,
  characterSet,
  content,
  axisSettings,
  onAxisSettingsChange,
}: {
  activeCharacter: string;
  uprightFontFile: string;
  italicFontFile?: string;
  characterSet: CharacterSetProps[];
  setActiveCharacter: (character: string) => void;
  content: typeface;
  axisSettings: AxisSettingsProps;
  onAxisSettingsChange: (settings: AxisSettingsProps) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const setFontName = `${slugify(content.name)}VAR`;
  const fontFile = axisSettings.italic && italicFontFile ? italicFontFile : uprightFontFile;

  const { error, loaded } = useFont(setFontName, fontFile);

  // Reset selected variant when active character changes
  useEffect(() => {
    setSelectedVariant(null);
  }, [activeCharacter]);

  // Find the current character and its variants
  const currentCharacter = characterSet.find((char) => char.value === activeCharacter);
  const variants = currentCharacter?.variants ? Object.entries(currentCharacter.variants) : [];

  // Get the character to display (variant or original)
  const displayCharacter = selectedVariant || activeCharacter;

  if (error) return <div>Error loading font</div>;
  if (!loaded) return <div>Loading font</div>;

  return (
    <div className="relative flex h-full w-full flex-col gap-y-2 py-8 pl-8">
      {/* Main Character Display */}
      <div className="relative flex h-[70vh] w-full flex-col justify-between rounded-2xl border border-solid border-neutral-700">
        <div
          id="character-viewer"
          className="relative flex h-[85%] w-full items-center justify-center rounded-lg text-[30vw] text-white"
          style={{
            fontFamily: setFontName,
            fontVariationSettings: `'wght' ${axisSettings.wght}${content.has_wdth ? `, 'wdth' ${axisSettings.wdth}` : ""}${content.has_slnt ? `, 'slnt' ${axisSettings.slnt}` : ""}${content.has_opsz ? `, 'opsz' ${axisSettings.opsz}` : ""}`,
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
              setFontName={setFontName}
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
