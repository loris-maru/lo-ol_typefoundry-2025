import { useEffect, useMemo, useRef, useState } from "react";

import { AxisSettings } from "@/types/character-set";
import { CharacterSetProps, typeface } from "@/types/typefaces";
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

function measureDOMTextMetrics(element: HTMLElement): Measured {
  const computedStyle = getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  
  // Create a temporary canvas with the same font settings
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = computedStyle.font;
  
  const m = (s: string) => ctx.measureText(s);
  const mCommon = m("Hg");
  const mCap = m("H");
  const mX = m("x");

  const ascent = mCommon.actualBoundingBoxAscent ?? mCap.actualBoundingBoxAscent ?? 0;
  const descent = mCommon.actualBoundingBoxDescent ?? 0;
  const capHeight = mCap.actualBoundingBoxAscent ?? null;
  const xHeight = mX.actualBoundingBoxAscent ?? null;

  return { ascent, descent, xHeight, capHeight, fontSizePx: fontSize };
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
  const glyphRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<Measured | null>(null);
  
  // Fixed baseline offset
  const baselineOffset = 360;

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

  // Construct font URL - use varFont for variable fonts, fallback to regular font
  const fontUrl = content.varFont ? `/api/fonts/${content.varFont.split('/').pop()}` : null;

  // === NEW: Measure actual metrics of the rendered font size ===
  useEffect(() => {
    if (!glyphRef.current) return;

    // Use the DOM-based measurement for more accuracy
    const m = measureDOMTextMetrics(glyphRef.current);
    setMetrics(m);
  }, [fontName, displayCharacter, wght, wdth, slnt, opsz]);

  // Force guides recalculation when character changes
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      if (glyphRef.current && characterRef.current) {
        // Trigger a re-render by updating a dummy state
        setMetrics(prev => prev ? { ...prev } : null);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [displayCharacter]);

  // === NEW: Convert metrics to Y positions inside the centered box ===
  // The glyph box is vertically centered inside characterRef (items-center, leading-none).
  // Baseline Y from top of the viewer box:
  const guides = useMemo(() => {
    if (!characterRef.current || !glyphRef.current || !metrics) return null;

    const box = characterRef.current;
    const glyph = glyphRef.current;
    const boxH = box.clientHeight;

    // Get the actual position of the glyph within the container
    const glyphRect = glyph.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    
    // Calculate the glyph's top position relative to the container
    const glyphTop = glyphRect.top - boxRect.top;

    // The baseline should be at the actual baseline of the text
    // Since the text is vertically centered, the baseline is at glyphTop + ascent
    // Add manual offset for fine-tuning
    const baselineY = glyphTop + metrics.ascent + baselineOffset;

    return {
      baselineY,
      ascenderY: baselineY - metrics.ascent,
      descenderY: baselineY + metrics.descent,
      xHeightY: metrics.xHeight != null ? baselineY - metrics.xHeight : null,
      capHeightY: metrics.capHeight != null ? baselineY - metrics.capHeight : null,
    };
  }, [metrics, characterRef.current, glyphRef.current, baselineOffset]);

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

          {/* Rendered glyph */}
          <div
            ref={glyphRef}
            className="relative z-10 block"
            style={{
              fontFamily: fontName,
              fontVariationSettings: `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}, 'opsz' ${opsz}`,
            }}
          >
            {displayCharacter}
            {/* <MetricGlyphPreview
              fontUrl={fontUrl ?? ''}
              char={activeCharacter}
              fontSizePx={600}
              paddingPx={16}
              style={{
                transform: 'scale(2)',
              }}
            /> */}
          </div>

          {/* Baseline indicator */}
          {guides && (
            <>
              {/* Baseline line */}
              <div
                className="absolute w-full h-px bg-white z-20"
                style={{
                  top: `${guides.baselineY}px`,
                  left: 0,
                }}
              />
              {/* Baseline label */}
              <div
                className="absolute text-xs font-whisper text-white z-20"
                style={{
                  top: `${guides.baselineY + 12}px`,
                  left: '12px',
                }}
              >
                Baseline
              </div>
            </>
          )}
        </div>

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
