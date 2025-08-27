"use client";

import { typeface } from "@/types/typefaces";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import PlaygroundHeader from "./header";
import OneColumnSection from "./one-column-section";
import ThreeColumnSection from "./three-column-section";
import TwoColumnSection from "./two-column-section";

export default function Playground({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="relative w-full">
      <motion.div
        className="sticky top-0 z-20 flex items-center justify-center min-h-screen"
        style={{ opacity: earlyOpacity, pointerEvents: earlyPointer }}
      >
        <motion.div
          className="font-fuzar relative flex w-full flex-col items-start justify-start overscroll-auto no-scrollbar bg-[#F5F5F5] p-10 scrollbar-hide"
          style={{ width, height, borderRadius: radius, overflowY }}
        >
          <div className="relative flex flex-col w-full gap-4">
            <PlaygroundHeader content={content} />

            {/* Column Sections */}
            <div className="w-full mt-3">
              {/* One Column Section */}
              <OneColumnSection content={content} />

              {/* Divider */}
              <div className="my-4 border-t border-gray-200" />

              {/* Two Column Section */}
              <TwoColumnSection content={content} />

              {/* Divider */}
              <div className="my-4 border-t border-gray-200" />

              {/* Three Column Section */}
              <ThreeColumnSection content={content} />
            </div>
          </div>
        </motion.div>
        <style jsx>{`
          /* Hide scrollbars for all browsers */
          .scrollbar-hide {
            -ms-overflow-style: none !important; /* Internet Explorer 10+ */
            scrollbar-width: none !important; /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none !important; /* Safari and Chrome */
            width: 0 !important;
            height: 0 !important;
          }
          .no-scrollbar {
            -ms-overflow-style: none !important; /* Internet Explorer 10+ */
            scrollbar-width: none !important; /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none !important; /* Safari and Chrome */
            width: 0 !important;
            height: 0 !important;
          }
          /* Additional global scrollbar hiding */
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
        `}</style>
      </motion.div>
    </section>
  );
}
