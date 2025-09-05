import { AxisSettings } from "@/types/character-set";
import { typeface } from "@/types/typefaces";
import { cn } from "@/utils/classNames";

export default function Variants({
  activeCharacter,
  variants,
  selectedVariant,
  setSelectedVariant,
  fontName,
  axisSettings,
  content,
  isInverted = false,
}: {
  activeCharacter: string;
  variants: [string, string][];
  selectedVariant: string | null;
  setSelectedVariant: (variant: string | null) => void;
  fontName: string;
  axisSettings: AxisSettings;
  content: typeface;
  isInverted?: boolean;
}) {
  const wdth = content.has_wdth ? axisSettings.wdth : 900;
  const slnt = content.has_slnt ? axisSettings.slnt : 0;
  const opsz = content.has_opsz ? axisSettings.opsz : 900;

  return (
    <div className="flex h-full w-full flex-col">
      <h3
        className={`font-whisper mb-2 text-base font-medium ${
          isInverted ? "text-black" : "text-white"
        }`}
      >
        Variants
      </h3>
      <div className="flex flex-1 flex-wrap gap-2 overflow-y-auto">
        {/* Original character button */}
        <button
          type="button"
          onClick={() => setSelectedVariant(null)}
          className={cn(
            "flex h-12 min-w-12 items-center justify-center rounded border px-4 text-base transition-colors",
            isInverted
              ? selectedVariant === null
                ? "border-black bg-black text-white"
                : "border-black text-black hover:border-neutral-300 hover:bg-gray-200"
              : selectedVariant === null
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
              isInverted
                ? selectedVariant === variantValue
                  ? "border-neutral-300 bg-black text-white"
                  : "border-neutral-300 text-black hover:border-black hover:bg-gray-200"
                : selectedVariant === variantValue
                  ? "border-neutral-700 bg-white text-black"
                  : "border-neutral-700 text-white hover:border-neutral-700 hover:bg-gray-800"
            }`}
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' ${axisSettings.wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
            }}
          >
            {variantValue as string}
          </button>
        ))}
      </div>
    </div>
  );
}
