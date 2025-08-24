"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { FiGlobe } from "react-icons/fi";

/**
 * Standalone Playground component:
 * - Sticky container animates width 50vw -> 100vw as its top reaches top of viewport
 * - Background #F5F5F5, padding 40px (p-10)
 * - Big editable text using your "Fuzar" typeface (make sure it's loaded via @font-face)
 * - Toggleable menu (32x32 button with FiGlobe) for wght / wdth / slnt / line-height / reverse colors
 */
export default function Playground(_: { progress?: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Menu + type tester state
  const [menuOpen, setMenuOpen] = useState(false);
  const [specimen, setSpecimen] = useState("THE QUICK BROWN FOX\n0123456789");
  const [wght, setWght] = useState(700);
  const [wdth, setWdth] = useState(100);
  const [slnt, setSlnt] = useState(0);
  const [lh, setLh] = useState(1.1);
  const [reverse, setReverse] = useState(false);

  const variation = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}`;

  // Local scroll progress to drive width/height/radius
  const { scrollYProgress: localProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const width = useTransform(localProgress, [0, 1], ["50vw", "100vw"]);
  const height = useTransform(localProgress, [0, 1], ["80vh", "100vh"]);
  const radius = useTransform(localProgress, [0, 1], ["50px", "0px"]);
  const overflowY = useTransform(localProgress, (v) =>
    v >= 1 ? "auto" : "hidden"
  );

  // Early fade-in on first part of page scroll (optional polish)
  const { scrollY } = useScroll();
  const earlyOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const earlyPointer = useTransform(scrollY, (y) =>
    y < 80 ? ("none" as const) : ("auto" as const)
  );

  return (
    <section ref={sectionRef} className="relative w-full h-[200vh]">
      <motion.div
        className="sticky top-0 z-20 flex items-center justify-center h-screen"
        style={{ opacity: earlyOpacity, pointerEvents: earlyPointer }}
      >
        <motion.div
          className="font-fuzar relative flex w-full flex-col items-start justify-start overscroll-auto no-scrollbar bg-[#F5F5F5] p-10"
          style={{ width, height, borderRadius: radius, overflowY }}
        >
          <div className="relative flex flex-col h-full w-full gap-4">
            <Header />

            {/* Menu toggle button (32x32) */}
            <button
              type="button"
              aria-label="Open type controls"
              onClick={() => setMenuOpen((v) => !v)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-md border border-black/20 bg-white shadow-sm"
            >
              <FiGlobe className="h-4 w-4" />
            </button>

            {/* Controls menu */}
            {menuOpen && (
              <div className="absolute right-4 top-14 z-20 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
                <div className="space-y-3 text-sm">
                  <label className="block">
                    <span className="mb-1 block">Weight ({wght})</span>
                    <input
                      type="range"
                      min={100}
                      max={900}
                      step={1}
                      value={wght}
                      onChange={(e) => setWght(+e.target.value)}
                      className="w-full"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block">Width ({wdth})</span>
                    <input
                      type="range"
                      min={75}
                      max={125}
                      step={1}
                      value={wdth}
                      onChange={(e) => setWdth(+e.target.value)}
                      className="w-full"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block">Slant ({slnt})</span>
                    <input
                      type="range"
                      min={-12}
                      max={0}
                      step={1}
                      value={slnt}
                      onChange={(e) => setSlnt(+e.target.value)}
                      className="w-full"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block">
                      Line-height ({lh.toFixed(2)})
                    </span>
                    <input
                      type="range"
                      min={0.8}
                      max={1.8}
                      step={0.01}
                      value={lh}
                      onChange={(e) => setLh(+e.target.value)}
                      className="w-full"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reverse}
                      onChange={(e) => setReverse(e.target.checked)}
                    />
                    <span>Reverse colors</span>
                  </label>
                </div>
              </div>
            )}

            {/* Editable big text specimen */}
            <div
              className={`relative mt-16 flex-1 rounded-xl ${
                reverse ? "bg-black text-white" : "bg-white text-black"
              } p-6`}
              style={{
                fontFamily: "Fuzar, ui-sans-serif, system-ui",
              }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) =>
                  setSpecimen((e.target as HTMLDivElement).innerText)
                }
                className="min-h-[40vh] whitespace-pre-wrap focus:outline-none"
                style={{
                  fontVariationSettings: variation as unknown as string,
                  lineHeight: lh,
                  fontSize: "min(12vw, 120px)",
                  fontWeight: 1,
                }}
              >
                {specimen}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  );
}

/** Simple inline header to avoid external imports **/
function Header() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left text-neutral-400 text-sm">
      <div>
        <p>
          Typeface: <span className="text-neutral-600">Fuzar</span>
        </p>
        <p>Designer: Your Name</p>
      </div>
      <div>
        <p>Release: 2025</p>
        <p>License: Desktop / Web / App</p>
      </div>
      <div>
        <p>Languages: Latin, Extended</p>
        <p>Features: Stylistic sets, ligatures</p>
      </div>
    </div>
  );
}
