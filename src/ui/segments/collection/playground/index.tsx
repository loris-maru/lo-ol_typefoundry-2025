"use client";

import { typeface } from "@/types/typefaces";
import AddBlock from "@/ui/segments/collection/playground/blocks/add-block";
import OneColumnSection from "@/ui/segments/collection/playground/blocks/one-column-section";
import ThreeColumnSection from "@/ui/segments/collection/playground/blocks/three-column-section";
import TwoColumnSection from "@/ui/segments/collection/playground/blocks/two-column-section";
import PlaygroundHeader from "@/ui/segments/collection/playground/header";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function Playground({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState([
    { type: "one", id: 1 },
    { type: "two", id: 2 },
    { type: "three", id: 3 },
  ]);

  // Scroll progress based on PlaygroundHeader reaching the top
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const width = useTransform(scrollYProgress, [0, 1], ["50vw", "100vw"]);
  const radius = useTransform(scrollYProgress, [0, 1], ["50px", "0px"]);

  // Early fade-in on first part of page scroll (optional polish)
  const { scrollY } = useScroll();
  const earlyOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const earlyPointer = useTransform(scrollY, (y) =>
    y < 80 ? ("none" as const) : ("auto" as const)
  );

  const addSection = (type: "one" | "two" | "three") => {
    const newId = Math.max(...sections.map((s) => s.id)) + 1;
    setSections([...sections, { type, id: newId }]);
  };

  const renderSection = (section: { type: string; id: number }) => {
    switch (section.type) {
      case "one":
        return <OneColumnSection key={section.id} content={content} />;
      case "two":
        return <TwoColumnSection key={section.id} content={content} />;
      case "three":
        return <ThreeColumnSection key={section.id} content={content} />;
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full">
      <motion.div
        className="sticky top-0 z-20 flex items-start justify-center"
        style={{ opacity: earlyOpacity, pointerEvents: earlyPointer }}
      >
        <motion.div
          className="font-fuzar relative flex w-full flex-col items-start justify-start bg-[#F5F5F5] p-10"
          style={{ width, borderRadius: radius }}
        >
          <div className="relative flex flex-col w-full gap-4 pb-16">
            <div ref={sectionRef}>
              <PlaygroundHeader content={content} />
            </div>

            {/* Column Sections */}
            <div className="w-full mt-3">
              {sections.map((section) => (
                <div key={section.id}>
                  {renderSection(section)}
                  {/* Divider between sections */}
                  {section.id < sections.length && (
                    <div className="my-4 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Add Section Block */}
            <AddBlock addSection={addSection} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
