"use client";

import React, { useCallback, useMemo, useState } from "react";

type WeightDef = { name: string; value: number; abbr: string };

const WEIGHTS: WeightDef[] = [
  { name: "Thin", value: 100, abbr: "Th" },
  { name: "ExtraLight", value: 200, abbr: "EL" },
  { name: "Light", value: 300, abbr: "Li" },
  { name: "Regular", value: 400, abbr: "Re" },
  { name: "Medium", value: 500, abbr: "Me" },
  { name: "Semibold", value: 600, abbr: "Se" },
  { name: "Bold", value: 700, abbr: "Bo" },
  { name: "ExtraBold", value: 800, abbr: "EB" },
  { name: "Black", value: 900, abbr: "Bl" },
];

/** More-contrasted (still light) gray ramp: #F2F2F2 → #C7C7C7 across 9 cells. */
function bgForIndex(idx: number): string {
  const start = 242; // F2
  const end = 199; // C7
  const t = idx / 8; // 0..1
  const g = Math.round(start + (end - start) * t);
  return `rgb(${g}, ${g}, ${g})`;
}

// Memoized tile component to prevent unnecessary re-renders
const WeightTile = React.memo(
  ({
    idx,
    row,
    col,
    isHovered,
    widthPct,
    flipped,
    setFlipped,
    wdthUI,
    setWdthUI,
    setHovered,
  }: {
    idx: number;
    row: number;
    col: number;
    isHovered: boolean;
    widthPct: number;
    flipped: Record<number, boolean>;
    setFlipped: (
      fn: (prev: Record<number, boolean>) => Record<number, boolean>
    ) => void;
    wdthUI: Record<number, number>;
    setWdthUI: (
      fn: (prev: Record<number, number>) => Record<number, number>
    ) => void;
    setHovered: (idx: number | null) => void;
  }) => {
    const reversed = !!flipped[idx];
    const bg = bgForIndex(idx);
    const fg = reversed ? "#fff" : "#000";
    const bgColor = reversed ? "#000" : bg;

    const tileBaseWght = WEIGHTS[idx].value;
    const uiWdth = wdthUI[idx] ?? 100;

    // Memoize expensive calculations
    const tileStyles = useMemo(() => {
      const baseSize = "min(8vw, 12vh)";
      const reducedSize = "min(5.6vw, 8.4vh)";
      const enlargedAbbr = "min(10.4vw, 15.6vh)";
      const abbrSize = isHovered ? enlargedAbbr : reducedSize;
      const lineSize = isHovered ? baseSize : reducedSize;
      const abbrWght = isHovered
        ? tileBaseWght
        : Math.max(100, Math.round(tileBaseWght * 0.7));
      const step = Math.max(0, Math.min(8, (tileBaseWght - 100) / 100));
      const strokeWidth = 2 + 1 * step;

      return {
        abbrSize,
        lineSize,
        abbrWght,
        strokeWidth,
      };
    }, [isHovered, tileBaseWght]);

    const handleMouseEnter = useCallback(
      () => setHovered(idx),
      [idx, setHovered]
    );
    const handleMouseLeave = useCallback(() => setHovered(null), [setHovered]);
    const handleReverse = useCallback(
      () => setFlipped((s) => ({ ...s, [idx]: !s[idx] })),
      [idx, setFlipped]
    );
    const handleWidthChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setWdthUI((s) => ({ ...s, [idx]: Number(e.target.value) })),
      [idx, setWdthUI]
    );

    return (
      <div
        className={`relative overflow-hidden p-6 ${
          isHovered ? "is-hovered" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: `${widthPct}%`,
          transition: "width 600ms cubic-bezier(.2,.8,.2,1)",
          backgroundColor: bgColor,
          color: fg,
          fontFamily: "Fuzar, ui-sans-serif, system-ui",
          fontVariationSettings: `'wght' ${tileBaseWght}`,
        }}
      >
        {/* Abbreviation wrapper with tracing border on hover */}
        <div
          className="relative inline-flex items-center justify-center abbr-wrap"
          style={{
            borderRadius: "50%",
            fontSize: tileStyles.abbrSize,
            justifyContent: isHovered ? "center" : "flex-start",
            padding: isHovered ? "0.45em 0.55em" : "0",
            minWidth: "1.8em",
            minHeight: "1.8em",
            aspectRatio: "1 / 1",
            transition:
              "font-size 500ms ease, border-radius 500ms ease, padding 500ms ease, justify-content 500ms ease",
          }}
        >
          {/* SVG border (animated trace) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <circle
              cx="50"
              cy="50"
              r={50 - tileStyles.strokeWidth / 2 - 1}
              fill="none"
              stroke={fg}
              strokeWidth={tileStyles.strokeWidth}
              className="trace-stroke"
            />
          </svg>

          {/* Abbreviation text */}
          <div
            className="leading-[0.9]"
            style={{
              fontSize: "1em",
              transition: "font-size 500ms ease",
              marginLeft: isHovered ? 0 : "0.15em",
              fontVariationSettings: `'wght' ${tileStyles.abbrWght}, 'wdth' ${uiWdth}`,
            }}
          >
            {WEIGHTS[idx].abbr}
          </div>
        </div>

        {/* Weight info line */}
        <div
          className="mt-[0.6vh] leading-[0.95]"
          style={{
            fontSize: tileStyles.lineSize,
            position: "relative",
            top: isHovered ? "0px" : "-30px",
            transition:
              "font-size 500ms ease, margin-left 500ms ease, top 600ms cubic-bezier(.2,.8,.2,1)",
            marginLeft: isHovered ? 0 : "0.15em",
            fontVariationSettings: `'wght' ${tileStyles.abbrWght}, 'wdth' ${uiWdth}`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: isHovered ? "1000px" : "0px",
              transform: isHovered ? "translateX(0)" : "translateX(-16px)",
              opacity: isHovered ? 1 : 0,
              transition:
                "max-width 600ms cubic-bezier(.2,.8,.2,1), transform 600ms cubic-bezier(.2,.8,.2,1), opacity 600ms ease",
              marginRight: isHovered ? "0.25em" : 0,
            }}
          >
            {WEIGHTS[idx].name} -
          </span>
          <span style={{ display: "inline-block" }}>{WEIGHTS[idx].value}</span>
        </div>

        {/* Footer: index/total — Fuzar */}
        {isHovered && (
          <div
            className="absolute left-[1%] bottom-[2%] text-sm select-none font-sans"
            style={{
              opacity: isHovered ? 0.8 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 500ms ease, transform 500ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            Fuzar {idx + 1}/9
          </div>
        )}

        {/* Controls (only on hovered tile) */}
        {isHovered && (
          <div className="absolute right-[1%] bottom-[2%] flex items-center gap-3">
            {/* Reverse colors */}
            <button
              onClick={handleReverse}
              className={`font-sans text-xs font-medium px-3 py-1 rounded-full border transition ${
                reversed
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Reverse
            </button>

            {/* WIDTH slider (100–900), affects ONLY abbr + line */}
            <div className="flex items-center gap-2">
              <span className="font-sans text-[11px] tracking-wide text-black">
                width
              </span>
              <input
                type="range"
                min={100}
                max={900}
                step={1}
                value={uiWdth}
                onChange={handleWidthChange}
                className={`w-40 h-4 appearance-none bg-transparent font-sans ${
                  reversed ? "slider-wdth-white" : "slider-wdth"
                }`}
                aria-label="Width axis"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

WeightTile.displayName = "WeightTile";

export default function WeightsGridPanel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [wdthUI, setWdthUI] = useState<Record<number, number>>(() =>
    Object.fromEntries(WEIGHTS.map((_, i) => [i, 100]))
  );

  const hoveredCol = hovered === null ? null : hovered % 3;
  const hoveredRow = hovered === null ? null : Math.floor(hovered / 3);

  // Memoize row heights and column widths to prevent unnecessary recalculations
  const rowHeights = useMemo(() => {
    if (hoveredRow === null) return [33.3333, 33.3333, 33.3333];
    const arr = [20, 20, 20];
    arr[hoveredRow] = 60;
    return arr;
  }, [hoveredRow]);

  const colWidths = useMemo(() => {
    if (hoveredCol === null) return [33.3333, 33.3333, 33.3333];
    const arr = [20, 20, 20];
    arr[hoveredCol] = 60;
    return arr;
  }, [hoveredCol]);

  // Memoize the grid structure to prevent unnecessary re-renders
  const gridStructure = useMemo(() => {
    return Array.from({ length: 3 }, (_, row) => ({
      row,
      height: rowHeights[row],
      cols: Array.from({ length: 3 }, (_, col) => ({
        col,
        idx: row * 3 + col,
        width: colWidths[col],
      })),
    }));
  }, [rowHeights, colWidths]);

  return (
    <section className="h-[100vh] w-[100vw]">
      {/* 3 rows */}
      {gridStructure.map(({ row, height, cols }) => (
        <div
          key={row}
          className="flex w-full"
          style={{
            height: `${height}%`,
            transition: "height 600ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {/* 3 columns per row */}
          {cols.map(({ col, idx, width }) => (
            <WeightTile
              key={idx}
              idx={idx}
              row={row}
              col={col}
              isHovered={hovered === idx}
              widthPct={width}
              flipped={flipped}
              setFlipped={setFlipped}
              wdthUI={wdthUI}
              setWdthUI={setWdthUI}
              setHovered={setHovered}
            />
          ))}
        </div>
      ))}

      {/* Slider styling: black thumb & black track + stroke trace animation */}
      <style jsx global>{`
        .slider-wdth {
          --thumb-size: 14px;
          --track-height: 4px;
          --track-bg: #000;
          --thumb-bg: #000;
        }
        .slider-wdth::-webkit-slider-runnable-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
          cursor: pointer;
        }
        .slider-wdth::-moz-range-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: none;
          cursor: pointer;
        }
        .slider-wdth::-ms-track {
          height: var(--track-height);
          background: transparent;
          border-color: transparent;
          color: transparent;
        }
        .slider-wdth::-ms-fill-lower,
        .slider-wdth::-ms-fill-upper {
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth::-ms-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: none;
        }

        .slider-wdth-white {
          --thumb-size: 14px;
          --track-height: 4px;
          --track-bg: #fff;
          --thumb-bg: #fff;
        }
        .slider-wdth-white::-webkit-slider-runnable-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth-white::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          margin-top: calc((var(--track-height) - var(--thumb-size)) / 2);
          cursor: pointer;
        }
        .slider-wdth-white::-moz-range-track {
          height: var(--track-height);
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth-white::-moz-range-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: none;
          cursor: pointer;
        }
        .slider-wdth-white::-ms-track {
          height: var(--track-height);
          background: transparent;
          border-color: transparent;
          color: transparent;
        }
        .slider-wdth-white::-ms-fill-lower,
        .slider-wdth-white::-ms-fill-upper {
          background: var(--track-bg);
          border-radius: 9999px;
        }
        .slider-wdth-white::-ms-thumb {
          width: var(--thumb-size);
          height: var(--thumb-size);
          border-radius: 50%;
          background: var(--thumb-bg);
          border: none;
        }

        /* Animated border trace around abbreviation */
        .abbr-wrap .trace-stroke {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          transition: stroke-dashoffset 1200ms ease;
        }
        .is-hovered .abbr-wrap .trace-stroke {
          stroke-dashoffset: 0;
        }
      `}</style>
    </section>
  );
}
