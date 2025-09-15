"use client";

import { useRef, useState } from "react";

import { motion, useScroll, useTransform } from "motion/react";

import { typeface } from "@/types/typefaces";
import AddBlock from "@/ui/segments/collection/playground/blocks/add-block";
import OneColumnSection from "@/ui/segments/collection/playground/blocks/one-column-section";
import SectionPlaceholder from "@/ui/segments/collection/playground/blocks/section-placeholder";
import ThreeColumnSection from "@/ui/segments/collection/playground/blocks/three-column-section";
import TwoColumnSection from "@/ui/segments/collection/playground/blocks/two-column-section";
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

    // Default texts for each column type
    const defaultTexts = {
      one: [
        "Our goal is to connect both typographic cultures and share our knowledge of calligraphy, sketching, exploration and type design.",
      ],
      two: [
        "Typefaces and the technologies used to bring them to life on screen are already incredibly advanced and have been mastered by many designers...",
        "We hope that our website gives you a glimpse of a future where type design fully embraces digital. Of course, this is just the beginning...",
      ],
      three: [
        "The Eiger village of Grindelwald in the Bernese Oberland lies embedded in a welcoming and green hollow, surrounded by a commanding mountainscape with the Eiger north face and the Wetterhorn. This mountainscape and the numerous lookout points and activities make Grindelwald one of the most popular and cosmopolitan holiday and excursion destinations in Switzerland, and the largest ski resort in the Jungfrau region.",
        "The symbol of the «world's smallest metropolis» is the \"Jet d'eau\" – a fountain with a 140-metre-high water jet at the periphery of Lake Geneva. Most of the large hotels and many restaurants are situated on the right-hand shore of the lake. The old town, the heart of Geneva with the shopping and business quarter, holds sway over the left-hand shore.",
        'The Matterhorn and Switzerland are inseparably linked to each other. The pyramid shaped colossus of a mountain, which is very difficult to climb, is said to be the most-photographed mountain in the world. The Klein-Matterhorn ("Little Matterhorn"), which can be reached via a funicular, lies adjacent to the Matterhorn.',
      ],
    };

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
