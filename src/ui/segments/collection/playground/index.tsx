"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { usePlaygroundStore } from "../../../../states/playground";
import PlaygroundHeader from "./header";
import TextBlock from "./text-block";

export default function Playground(_: { progress?: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Menu + type tester state
  const [menuOpen, setMenuOpen] = useState(false);
  const [wght, setWght] = useState(700);
  const [wdth, setWdth] = useState(100);
  const [slnt, setSlnt] = useState(0);
  const [lh, setLh] = useState(1.1);

  // Playground state
  const { activeBlocks, addBlock, updateBlock } = usePlaygroundStore();

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
            <PlaygroundHeader />

            {/* Text blocks */}
            <div className="space-y-6 w-full">
              {activeBlocks.map((block, index) => (
                <div key={block.id}>
                  <TextBlock block={block} onUpdate={updateBlock} />
                  {/* Add divider between different column sections */}
                  {index < activeBlocks.length - 1 &&
                    activeBlocks[index + 1] &&
                    activeBlocks[index + 1].columns !== block.columns && (
                      <div className="my-8 border-t border-gray-200" />
                    )}
                </div>
              ))}
            </div>

            {/* Add one more block container */}
            <div className="flex flex-col items-center justify-center py-8 mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Add one more block
                </h3>
                <p className="text-sm text-gray-500">
                  Choose the column layout for your new block
                </p>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => addBlock(cols as 1 | 2 | 3)}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    {cols} Column{cols > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

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
                    <span className="mb-1 block">Line Height ({lh})</span>
                    <input
                      type="range"
                      min={0.8}
                      max={2.5}
                      step={0.1}
                      value={lh}
                      onChange={(e) => setLh(+e.target.value)}
                      className="w-full"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
