import { useEffect, useMemo, useRef, useState } from "react";

import { AxisSettings } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
import Legend from "@/ui/segments/collection/character-set/legend";
import VariableSettings from "@/ui/segments/collection/character-set/variable-settings";
import Variants from "@/ui/segments/collection/character-set/variants";
import { cn } from "@/utils/classNames";

type Measured = {
  ascent: number; // px above baseline
  descent: number; // px below baseline
  xHeight: number | null;
  capHeight: number | null;
  fontSizePx: number; // measured px size
};

function measureRenderedMetrics(
  fontFamily: string,
  fontSizePx: number,
  fontWeight?: number | string,
): Measured {
  // Offscreen canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  // Build a CSS font shorthand close to how the element renders:
  // style variant weight size family
  const weightPart = typeof fontWeight !== "undefined" ? String(fontWeight) : "normal";
  ctx.font = `${weightPart} ${fontSizePx}px "${fontFamily}"`;

  const m = (s: string) => ctx.measureText(s);
  // Use a combo that tends to cover vertical extremes
  const mCommon = m("Hg");
  const mCap = m("H");
  const mX = m("x");

  const ascent = mCommon.actualBoundingBoxAscent ?? mCap.actualBoundingBoxAscent ?? 0;
  const descent = mCommon.actualBoundingBoxDescent ?? 0;
  const capHeight = mCap.actualBoundingBoxAscent ?? null;
  const xHeight = mX.actualBoundingBoxAscent ?? null;

  return { ascent, descent, xHeight, capHeight, fontSizePx: fontSizePx || 1 };
}

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

  // NEW: precise metrics + baseline placement
  const characterRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState<Measured | null>(null);

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

    setMousePosition({ x, y });

    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    const newWeight = Math.round(100 + (yPercent / 100) * 800);

    let secondaryAxis: "opsz" | "wdth" | "slnt" | null = null;
    let newSecondaryValue = 0;

    if (content.has_opsz) {
      secondaryAxis = "opsz";
      newSecondaryValue = Math.round(100 + (xPercent / 100) * 800);
    } else if (content.has_wdth) {
      secondaryAxis = "wdth";
      newSecondaryValue = Math.round(100 + (xPercent / 100) * 800);
    } else if (content.has_slnt) {
      secondaryAxis = "slnt";
      newSecondaryValue = Math.round((xPercent / 100) * 90);
    }

    const newSettings = {
      ...axisSettings,
      wght: newWeight,
      ...(secondaryAxis && { [secondaryAxis]: newSecondaryValue }),
    };

    onAxisSettingsChange(newSettings);
  };

  const handleMouseEnter = () => setIsMouseInside(true);
  const handleMouseLeave = () => setIsMouseInside(false);

  const currentCharacter = characterSet.find((char) => char.value === activeCharacter);
  const variants = currentCharacter?.variants ? Object.entries(currentCharacter.variants) : [];
  const displayCharacter = selectedVariant || activeCharacter;

  const wght = axisSettings.wght;
  const wdth = content.has_wdth ? axisSettings.wdth : 900;
  const slnt = content.has_slnt ? axisSettings.slnt : 0;
  const opsz = content.has_opsz ? axisSettings.opsz : 900;

  // === NEW: Measure actual metrics of the rendered font size ===
  useEffect(() => {
    if (!glyphRef.current) return;

    // Get the computed font-size in px from the actual rendered element
    const cs = getComputedStyle(glyphRef.current);
    const sizePx = parseFloat(cs.fontSize || "0") || 0;

    if (!sizePx) return;

    // Map variable weight into the canvas "font-weight" slot (others may not be honored by canvas)
    const weightForCanvas = Math.round(Math.min(900, Math.max(100, wght)));

    const m = measureRenderedMetrics(fontName, sizePx, weightForCanvas);
    setMetrics(m);
  }, [fontName, displayCharacter, wght, wdth, slnt, opsz]);

  // === NEW: Convert metrics to Y positions inside the centered box ===
  // The glyph box is vertically centered inside characterRef (items-center, leading-none).
  // Baseline Y from top of the viewer box:
  const guides = useMemo(() => {
    if (!characterRef.current || !glyphRef.current || !metrics) return null;

    const box = characterRef.current;
    const boxH = box.clientHeight;

    // The line box height ~ fontSizePx when line-height: 1 (Tailwind "leading-none")
    const lineH = metrics.fontSizePx;

    // Top of the line box relative to the viewer box (because it's vertically centered)
    const lineTop = boxH / 2 - lineH / 2;

    // Baseline is lineTop + ascent
    const baselineY = lineTop + metrics.ascent;

    return {
      baselineY,
      ascenderY: baselineY - metrics.ascent,
      descenderY: baselineY + metrics.descent,
      xHeightY: metrics.xHeight != null ? baselineY - metrics.xHeight : null,
      capHeightY: metrics.capHeight != null ? baselineY - metrics.capHeight : null,
    };
  }, [metrics, characterRef.current]);

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
            <div
              className={cn(
                "absolute z-20 h-full w-px",
                isInverted ? "bg-neutral-400" : "bg-neutral-500",
              )}
              style={{ left: mousePosition.x, top: 0, transform: "translateX(-50%)" }}
            />
            <div
              className={cn(
                "absolute z-20 h-px w-full",
                isInverted ? "bg-neutral-400" : "bg-neutral-500",
              )}
              style={{ top: mousePosition.y, left: 0, transform: "translateY(-50%)" }}
            />
          </>
        )}

        <div
          ref={characterRef}
          id="character-viewer"
          className={`relative flex h-[85%] w-full items-center justify-center rounded-lg text-[30vw] ${
            isInverted ? "text-black" : "text-white"
          } leading-none`}
          style={{
            fontFamily: fontName,
            fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
          }}
        >
          {/* === Guides (now driven by real measurements) === */}
          {guides && (
            <div className="pointer-events-none absolute inset-0 z-0">
              {/* Baseline */}
              <div
                className={cn("absolute h-px w-full", isInverted ? "bg-red-500" : "bg-red-400")}
                style={{ top: `${guides.baselineY}px` }}
              />
              {/* Ascender line */}
              <div
                className={cn("absolute h-px w-full", isInverted ? "bg-blue-500" : "bg-blue-400")}
                style={{ top: `${guides.ascenderY}px` }}
              />
              {/* Cap height */}
              {guides.capHeightY != null && (
                <div
                  className={cn(
                    "absolute h-px w-full",
                    isInverted ? "bg-green-500" : "bg-green-400",
                  )}
                  style={{ top: `${guides.capHeightY}px` }}
                />
              )}
              {/* x-height */}
              {guides.xHeightY != null && (
                <div
                  className={cn(
                    "absolute h-px w-full",
                    isInverted ? "bg-yellow-500" : "bg-yellow-400",
                  )}
                  style={{ top: `${guides.xHeightY}px` }}
                />
              )}
              {/* Descender line */}
              <div
                className={cn(
                  "absolute h-px w-full",
                  isInverted ? "bg-purple-500" : "bg-purple-400",
                )}
                style={{ top: `${guides.descenderY}px` }}
              />
            </div>
          )}

          {/* Rendered glyph */}
          <span
            ref={glyphRef}
            className="relative z-10 block"
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
            }}
          >
            {displayCharacter}
          </span>
        </div>

        <Legend isInverted={isInverted} />

        {/* Variants */}
        <div className="relative flex h-auto w-full items-center px-6 pb-6">
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
                className={`font-whisper text-sm ${isInverted ? "text-neutral-500" : "text-neutral-500"}`}
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
