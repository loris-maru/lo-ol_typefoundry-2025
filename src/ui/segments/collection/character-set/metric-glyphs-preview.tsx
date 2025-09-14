"use client";

import { useEffect, useMemo, useState } from "react";

// dynamic import avoids SSR issues
let opentypePromise: Promise<typeof import("opentype.js")> | null = null;
const loadOpentype = () => {
  if (!opentypePromise) opentypePromise = import("opentype.js");
  return opentypePromise;
};

// Handle WOFF2 fonts using browser's FontFace API
async function loadFontMetrics(fontUrl: string, char: string, fontSizePx: number) {
  // Check if the font is WOFF2
  const response = await fetch(fontUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const view = new Uint8Array(buffer);
  const isWoff2 = view[0] === 0x77 && view[1] === 0x4f && view[2] === 0x46 && view[3] === 0x32; // "wOF2"

  if (isWoff2) {
    // Use FontFace API for WOFF2
    const fontFace = new FontFace("tempFont", buffer);
    await fontFace.load();
    document.fonts.add(fontFace);

    // Create a temporary element to measure the font
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${fontSizePx}px tempFont`;

    const metrics = ctx.measureText(char);
    const ascent = metrics.actualBoundingBoxAscent || 0;
    const descent = metrics.actualBoundingBoxDescent || 0;

    // Don't clean up immediately - keep the font loaded for rendering
    // document.fonts.delete(fontFace);

    return {
      ascent,
      descent,
      xHeight: ascent * 0.6, // Approximate x-height
      capHeight: ascent * 0.8, // Approximate cap-height
      fontSizePx,
    };
  } else {
    // Use opentype.js for TTF/OTF
    const opentype = await loadOpentype();
    const font = opentype.parse(buffer);

    const unitsPerEm = font.unitsPerEm || 1000;
    const os2 = (font as any).tables?.os2;
    const typoAsc =
      os2?.sTypoAscender ?? (font as any).tables?.hhea?.ascender ?? font.ascender ?? 0;
    const typoDesc =
      os2?.sTypoDescender ?? (font as any).tables?.hhea?.descender ?? font.descender ?? 0;
    const capHeight = os2?.sCapHeight ?? undefined;
    const xHeight = os2?.sxHeight ?? undefined;

    const scale = fontSizePx / unitsPerEm;

    return {
      ascent: typoAsc * scale,
      descent: Math.abs(typoDesc) * scale,
      xHeight: xHeight ? xHeight * scale : null,
      capHeight: capHeight ? capHeight * scale : null,
      fontSizePx,
    };
  }
}

export type MetricLinesProps = {
  fontUrl: string; // URL to the font file you’re displaying
  char: string; // your displayCharacter (single letter/number/symbol)
  fontSizePx?: number; // preview size in px (visual scale)
  paddingPx?: number; // left/right/top/bottom SVG padding
  className?: string; // wrapper class
  style?: React.CSSProperties; // wrapper style
};

export default function MetricGlyphPreview({
  fontUrl,
  char,
  fontSizePx = 1200, // 600 * 2 = 1200 (2x bigger)
  paddingPx = 32, // 16 * 2 = 32 (2x bigger padding)
  className,
  style,
}: MetricLinesProps) {
  const [state, setState] = useState<{
    ready: boolean;
    pathData: string;
    viewW: number;
    viewH: number;
    yAsc: number;
    yCap: number | null;
    yX: number | null;
    yBase: number;
    yDesc: number;
    isWoff2: boolean;
    fontFamily: string;
  }>({
    ready: false,
    pathData: "",
    viewW: 0,
    viewH: 0,
    yAsc: 0,
    yCap: null,
    yX: null,
    yBase: 0,
    yDesc: 0,
    isWoff2: false,
    fontFamily: "",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const metrics = await loadFontMetrics(fontUrl, char, fontSizePx);

        if (cancelled) return;

        // For WOFF2, we'll create a simple SVG path representation
        // For TTF/OTF, we'll use the opentype.js path generation
        const response = await fetch(fontUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch font for path generation: ${response.status} ${response.statusText}`,
          );
        }

        const buffer = await response.arrayBuffer();
        const view = new Uint8Array(buffer);
        const isWoff2 =
          view[0] === 0x77 && view[1] === 0x4f && view[2] === 0x46 && view[3] === 0x32;

        let pathData = "";
        let advance = 0;

        if (isWoff2) {
          // For WOFF2, we'll use a text element instead of a path
          // This will be handled in the render section
          const width = fontSizePx * 0.6; // Approximate character width
          advance = width;
          pathData = ""; // Empty path, we'll use text element
        } else {
          // Use opentype.js for TTF/OTF
          const opentype = await loadOpentype();
          const font = opentype.parse(buffer);
          const glyph = font.charToGlyph(char || " ");
          advance = (glyph.advanceWidth ?? 0) * (fontSizePx / (font.unitsPerEm || 1000));

          const yBase = metrics.ascent;
          const path = glyph.getPath(paddingPx, yBase, fontSizePx);
          pathData = path.toPathData(2);
        }

        const viewH = metrics.ascent + metrics.descent;
        const viewW = Math.max(advance + paddingPx * 4, fontSizePx * 1.5); // Increased padding and minimum width

        // Convert metric heights into Y positions within the same coordinate system
        const yAsc = paddingPx;
        const yCap =
          metrics.capHeight != null ? paddingPx + metrics.ascent - metrics.capHeight : null;
        const yX = metrics.xHeight != null ? paddingPx + metrics.ascent - metrics.xHeight : null;
        const yBaseline = paddingPx + metrics.ascent;
        const yDesc = paddingPx + metrics.ascent + metrics.descent;

        if (!cancelled) {
          setState({
            ready: true,
            pathData,
            viewW,
            viewH: viewH + paddingPx * 2,
            yAsc,
            yCap,
            yX,
            yBase: yBaseline,
            yDesc,
            isWoff2,
            fontFamily: isWoff2 ? "tempFont" : "",
          });
        }
      } catch (error) {
        console.error("Error loading font metrics:", error);
        if (!cancelled) {
          setState((prev) => ({ ...prev, ready: false }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fontUrl, char, fontSizePx, paddingPx]);

  const lines = useMemo(() => {
    if (!state.ready) return null;

    // Helper to make a non-scaling 1px horizontal rule across the SVG
    const HLine = (y: number, title: string, color: string) => (
      <g key={title}>
        <line
          x1={0}
          x2={state.viewW}
          y1={y}
          y2={y}
          stroke={color}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={0.6}
        />
        <text
          x={state.viewW - 20}
          y={y - 4}
          fontSize="24"
          fill="white"
          textAnchor="end"
          fontFamily="whisper"
          className="font-whisper text-sm text-white"
        >
          {title}
        </text>
      </g>
    );

    return (
      <>
        {/* Ascender */}
        {HLine(state.yAsc, "Ascender", "#3b82f6")}
        {/* Cap height (if present) */}
        {state.yCap != null && HLine(state.yCap, "Cap Height", "#10b981")}
        {/* x-height (if present) */}
        {state.yX != null && HLine(state.yX, "x-Height", "#f59e0b")}
        {/* Baseline */}
        {HLine(state.yBase, "Baseline", "#ef4444")}
        {/* Descender */}
        {HLine(state.yDesc, "Descender", "#8b5cf6")}
      </>
    );
  }, [state]);

  if (!state.ready) {
    return (
      <div className={["grid aspect-[3/2] w-full place-items-center", className].join(" ")}>
        <span className="font-whisper text-sm text-white">Loading font metrics…</span>
      </div>
    );
  }

  return (
    <div className={["relative h-full w-full", className].join(" ")}>
      {/* SVG scales responsively to the container width; strokes stay 1px */}
      <svg
        viewBox={`0 0 ${state.viewW} ${state.viewH}`}
        className="block h-full w-full text-neutral-400"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Glyph with metric lines"
      >
        {/* Metric lines */}
        {lines}
        {/* Glyph path (filled) or text for WOFF2 */}
        {state.isWoff2 ? (
          <text
            x={paddingPx}
            y={state.yBase}
            fontSize={fontSizePx}
            fontFamily={state.fontFamily}
            fill="#ffffff"
            style={{ fontFamily: state.fontFamily }}
          >
            {char}
          </text>
        ) : (
          <path d={state.pathData} fill="#ffffff" />
        )}
      </svg>
    </div>
  );
}
