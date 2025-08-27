"use client";
import { useEffect, useRef, useState } from "react";

function repeatToLength(str: string, minLen: number) {
  if (!str) return "";
  let out = str;
  while (out.length < minLen) out += str;
  return out;
}

export function CursorTextCircle({
  text = "Read • More • ",
  targetId,
  radius = 44,
  fontSize = 12,
  clockwise = true,
  showWhenNotHovering = false,
}: {
  /** The text that will be repeated around the circle (include separators like • or —). */
  text?: string;
  /** The id of the element that should trigger rotation/visibility on hover. */
  targetId: string;
  /** Radius of the circular text in pixels. */
  radius?: number;
  /** Font size (px) for the circular text. */
  fontSize?: number;
  /** Rotation direction. */
  clockwise?: boolean;
  /** If true, the cursor is visible even when not hovering the target (won't rotate until hover). */
  showWhenNotHovering?: boolean;
}) {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [hovering, setHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Follow the mouse with rAF throttling
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Bind hover listeners to the target element
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const enter = () => {
      setHovering(true);
      setIsVisible(true);
    };
    const leave = () => {
      setHovering(false);
      if (!showWhenNotHovering) setIsVisible(false);
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    // If we want it visible even when not hovering
    if (showWhenNotHovering) setIsVisible(true);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [targetId, showWhenNotHovering]);

  // SVG circle path dimensions
  const size = radius * 2 + fontSize * 2; // add some padding for glyphs
  const center = size / 2;
  const r = radius;

  // Repeat text to approximately match circumference
  const circumference = 2 * Math.PI * r;
  const repeated = repeatToLength(
    text,
    Math.ceil(circumference / Math.max(1, fontSize * 0.6))
  );

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "50%",
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%))`,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 180ms ease",
      }}
      aria-hidden
    >
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${clockwise ? 360 : -360}deg);
          }
        }
        .ring {
          width: ${size}px;
          height: ${size}px;
          display: block;
          will-change: transform;
        }
        .rotating {
          animation: spin 8s linear infinite;
        }
        .label {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          font-size: ${fontSize}px;
          letter-spacing: 2px;
          fill: black;
        }
      `}</style>

      <div className={`ring ${hovering ? "rotating" : ""}`}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <defs>
            <path
              id="circlePath"
              d={`M ${center},${center} m -${r},0 a ${r},${r} 0 1,1 ${
                r * 2
              },0 a ${r},${r} 0 1,1 -${r * 2},0`}
              fill="none"
            />
          </defs>
          <text className="label">
            <textPath href="#circlePath" startOffset="0%">
              {repeated}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
