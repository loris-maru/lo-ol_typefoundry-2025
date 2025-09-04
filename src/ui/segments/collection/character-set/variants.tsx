import { AxisSettingsProps } from "@/types/character-set";
import { typeface } from "@/types/typefaces";
import { cn } from "@/utils/classNames";

export default function Variants({
  activeCharacter,
  variants,
  selectedVariant,
  setSelectedVariant,
  setFontName,
  axisSettings,
  content,
}: {
  activeCharacter: string;
  variants: [string, string][];
  selectedVariant: string | null;
  setSelectedVariant: (variant: string | null) => void;
  setFontName: string;
  axisSettings: AxisSettingsProps;
  content: typeface;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <h3 className="font-whisper mb-2 text-base font-medium text-white">Variants</h3>
      <div className="flex flex-1 flex-wrap gap-2 overflow-y-auto">
        {/* Original character button */}
        <button
          type="button"
          onClick={() => setSelectedVariant(null)}
          className={cn(
            "flex h-12 min-w-12 items-center justify-center rounded border px-4 text-base transition-colors",
            selectedVariant === null
              ? "border-neutral-700 bg-white text-black"
              : "border-neutral-700 text-white hover:border-neutral-700 hover:bg-gray-800",
          )}
        >
          {activeCharacter}
        </button>

        {/* Variant buttons */}
        {variants.map(([variantName, variantValue]) => (
          <button
            key={variantName}
            type="button"
            onClick={() => setSelectedVariant(variantValue as string)}
            className={`flex h-12 min-w-12 items-center justify-center rounded border px-4 text-base transition-colors ${
              selectedVariant === variantValue
                ? "border-neutral-700 bg-white text-black"
                : "border-neutral-700 text-white hover:border-neutral-700 hover:bg-gray-800"
            }`}
            style={{
              fontFamily: setFontName,
              fontVariationSettings: `'wght' ${axisSettings.wght}${content.has_wdth ? `, 'wdth' ${axisSettings.wdth}` : ""}${content.has_slnt ? `, 'slnt' ${axisSettings.slnt}` : ""}${content.has_opsz ? `, 'opsz' ${axisSettings.opsz}` : ""}`,
              fontStyle: axisSettings.italic ? "italic" : "normal",
            }}
          >
            {variantValue as string}
          </button>
        ))}
      </div>
    </div>
  );
}
