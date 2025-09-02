// components/MorphicCursor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export type TargetState =
  | { type: 'free' }
  | {
      type: 'lock';
      // center position of the hovered element
      cx: number;
      cy: number;
      // element size
      w: number;
      h: number;
    };

export default function MorphicCursor({
  radiusPx = 120,
  defaultSizeVW = 14,
  transitionMs = 220,
  easing = 'cubic-bezier(.2,.8,.2,1)',
  className = '',
}: {
  radiusPx?: number;
  defaultSizeVW?: number; // 14 -> 14vw
  transitionMs?: number;
  easing?: string;
  className?: string;
}) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [target, setTarget] = useState<TargetState>({ type: 'free' });

  // default size in pixels (computed on resize)
  const defaultSizePxRef = useRef(0);

  useEffect(() => {
    const onResize = () => {
      defaultSizePxRef.current =
        (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * defaultSizeVW) /
        100;
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [defaultSizeVW]);

  // Mouse move tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Event delegation: watch for enter/leave on elements with data-cursor-target
  useEffect(() => {
    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor-target]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setTarget({
        type: 'lock',
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
      });
    };
    const onMouseOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      // If leaving a target, return to free mode
      if (el && (el as HTMLElement).closest?.('[data-cursor-target]')) {
        setTarget({ type: 'free' });
      }
    };
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  // Animate cursor element
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const apply = () => {
      el.style.willChange = 'transform, width, height';
      el.style.transition = `transform ${transitionMs}ms ${easing}, width ${transitionMs}ms ${easing}, height ${transitionMs}ms ${easing}, border-radius ${transitionMs}ms ${easing}`;
      el.style.borderRadius = `${radiusPx}px`;

      if (target.type === 'lock') {
        const { cx, cy, w, h } = target;
        el.style.width = `${Math.max(1, w)}px`;
        el.style.height = `${Math.max(1, h)}px`;
        // center on the target element
        el.style.transform = `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0)`;
      } else {
        const size = defaultSizePxRef.current || 0;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        // center on the pointer
        el.style.transform = `translate3d(${mouse.x - size / 2}px, ${mouse.y - size / 2}px, 0)`;
      }
    };

    apply();
  }, [mouse, target, transitionMs, easing, radiusPx]);

  return (
    <>
      {/* Optional: a wrapper if you want to limit the cursor to a section.
          Replace `fixed` with `absolute` + a relative parent. */}
      <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[60]">
        <div
          ref={cursorRef}
          className={`pointer-events-none absolute bg-black/10 ring-1 ring-black/20 backdrop-blur-sm ${className}`}
          style={{
            borderRadius: radiusPx,
            // Start somewhere off-screen before first mouse move
            transform: 'translate3d(-1000px, -1000px, 0)',
          }}
        />
      </div>
    </>
  );
}
