import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { useEffect, useState } from "react";
import MajorBlock from "./major-bloc";

export type BlockContent = {
  title: string;
  description: string;
  label: string | null;
  link: string | null;
};

export default function FontInfoPanel({
  content,
}: {
  content: typeface;
  collectionColor: string;
}) {
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Calculate dynamic font weight based on mouse Y position
  const calculateFontWeight = () => {
    const viewportHeight = window.innerHeight;
    const normalizedY = mouseY / viewportHeight; // 0 at top, 1 at bottom
    const weight = Math.round(100 + normalizedY * 800); // 100 to 900
    return Math.max(100, Math.min(900, weight)); // Clamp between 100-900
  };

  const dynamicWeight = calculateFontWeight();

  const allDesigners = () => {
    const designers = [];
    for (const designer of content.designers) {
      const designContent = {
        title: designer.fullName,
        description: designer.biography,
        label: "contact",
        link: designer.instagram,
      };
      designers.push(designContent);
    }
    return designers;
  };

  const designers = allDesigners();

  const blocContent1: BlockContent[] = [
    {
      title: content.name,
      description:
        "This is a trial font package. It is a free trial of the font.",
      label: "Download Fonts",
      link: null,
    },
    {
      title: "Description",
      description: "12 files\nOTF, WOFF, WOFF2",
      label: null,
      link: null,
    },
  ];

  const blocContent2: BlockContent[] = [
    {
      title: "Collection specimen",
      description: "Presentation of all weights and styles PDF file",
      label: "Download Specimen",
      link: null,
    },
  ];

  const blocContent3: BlockContent[] = designers;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#EFEFEF]">
      <MajorBlock
        index={0}
        title="Trial font package"
        subtitle={content.name}
        description={blocContent1}
        hasButton
        label="Download Fonts"
      />
      <MajorBlock
        index={1}
        title="Collection specimen"
        subtitle={content.name}
        description={blocContent2}
        hasButton
        label="Download Specimen"
      />
      <MajorBlock
        index={2}
        title="Designer and story"
        subtitle={content.name}
        description={blocContent3}
        hasButton={false}
      />

      {/* Giant abbreviation in fixed position */}
      <div className="absolute z-20 w-full h-full flex items-center justify-center mix-blend-exclusion">
        <div
          id="giant-abbreviation"
          className="text-[80vw] text-neutral-800"
          style={{
            fontFamily: slugify(content.name),
            fontVariationSettings: `'wght' ${dynamicWeight}, 'slnt' 0, 'opsz' 900, 'wdth' 900`,
          }}
        >
          {content.name.slice(0, 1)}
        </div>
      </div>

      {/* Revealer as mask - uses mix-blend-mode to reveal the abbreviation */}
      <div
        id="revealer"
        className="absolute left-0 z-10 w-full h-1/3 bg-black transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${mouseY - 150}px)`,
        }}
      />
    </div>
  );
}
