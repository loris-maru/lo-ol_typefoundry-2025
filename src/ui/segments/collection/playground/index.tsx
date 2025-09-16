"use client";

import { useRef, useState } from "react";

import { motion, useScroll, useTransform } from "motion/react";

import { typeface } from "@/types/typefaces";
import AddBlock from "@/ui/segments/collection/playground/blocks/add-block";
import OneColumnSection from "@/ui/segments/collection/playground/blocks/one-column-section";
import SectionPlaceholder from "@/ui/segments/collection/playground/blocks/section-placeholder";
import ThreeColumnSection from "@/ui/segments/collection/playground/blocks/three-column-section";
import TwoColumnSection from "@/ui/segments/collection/playground/blocks/two-column-section";
import defaultTexts from "@/ui/segments/collection/playground/CONTENT";
import PlaygroundHeader from "@/ui/segments/collection/playground/header";

export default function Playground({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Default sections (always text)
  const [defaultSections] = useState([
    { type: "one", id: 1 },
    { type: "two", id: 2 },
    { type: "three", id: 3 },
  ]);

  // New sections (user-added, with placeholder state)
  const [newSections, setNewSections] = useState<
    Array<{
      id: number;
      type: "one" | "two" | "three";
      columnTypes: ("text" | "image")[];
      imageUrls: (string | null)[];
    }>
  >([]);

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
    y < 80 ? ("none" as const) : ("auto" as const),
  );

  const addSection = (type: "one" | "two" | "three") => {
    const newId =
      Math.max(...defaultSections.map((s) => s.id), ...newSections.map((s) => s.id), 0) + 1;
    const columnCount = type === "one" ? 1 : type === "two" ? 2 : 3;

    const newSection = {
      id: newId,
      type,
      columnTypes: Array(columnCount).fill(null) as ("text" | "image")[],
      imageUrls: Array(columnCount).fill(null) as (string | null)[],
    };

    setNewSections([...newSections, newSection]);
  };

  const handleSectionTypeChange = (
    sectionId: number,
    columnIndex: number,
    type: "text" | "image",
  ) => {
    setNewSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              columnTypes: section.columnTypes.map((colType, index) =>
                index === columnIndex ? type : colType,
              ),
            }
          : section,
      ),
    );
  };

  const handleImageChange = (sectionId: number, columnIndex: number, imageUrl: string | null) => {
    setNewSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              imageUrls: section.imageUrls.map((url, index) =>
                index === columnIndex ? imageUrl : url,
              ),
            }
          : section,
      ),
    );
  };

  const handleDeleteSection = (sectionId: number) => {
    setNewSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const renderDefaultSection = (section: { type: string; id: number }) => {
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

  const renderNewSection = (section: {
    id: number;
    type: "one" | "two" | "three";
    columnTypes: ("text" | "image")[];
    imageUrls: (string | null)[];
  }) => {
    const columnCount = section.type === "one" ? 1 : section.type === "two" ? 2 : 3;

    const defaultFontSizes =
      section.type === "one" ? [64] : section.type === "two" ? [30, 30] : [20, 20, 20];
    const defaultWeights =
      section.type === "one" ? [900] : section.type === "two" ? [500, 500] : [400, 400, 400];
    const defaultLineHeights =
      section.type === "one" ? [1.1] : section.type === "two" ? [1.25, 1.25] : [1.4, 1.4, 1.4];
    const defaultWidths = Array(columnCount).fill(900);
    const defaultSlants = Array(columnCount).fill(0);

    return (
      <SectionPlaceholder
        key={section.id}
        content={content}
        columns={columnCount}
        sectionId={section.id}
        onSectionTypeChange={handleSectionTypeChange}
        onImageChange={handleImageChange}
        onDeleteSection={handleDeleteSection}
        columnTypes={section.columnTypes}
        imageUrls={section.imageUrls}
        defaultTexts={defaultTexts[section.type]}
        defaultFontSizes={defaultFontSizes}
        defaultWeights={defaultWeights}
        defaultLineHeights={defaultLineHeights}
        defaultWidths={defaultWidths}
        defaultSlants={defaultSlants}
      />
    );
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
          <div className="relative flex w-full flex-col gap-4 pb-16">
            <div ref={sectionRef}>
              <PlaygroundHeader content={content} />
            </div>

            {/* Column Sections */}
            <div className="mt-3 w-full">
              {/* Default sections (always text) */}
              {defaultSections.map((section) => (
                <div key={section.id}>
                  {renderDefaultSection(section)}
                  {/* Divider between sections */}
                  <div className="my-4 border-t border-gray-200" />
                </div>
              ))}

              {/* New sections (user-added, with placeholder state) */}
              {newSections.map((section) => (
                <div key={section.id}>
                  {renderNewSection(section)}
                  {/* Divider between sections */}
                  <div className="my-4 border-t border-gray-200" />
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
