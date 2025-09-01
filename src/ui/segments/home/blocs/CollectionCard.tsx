import type { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { useFont } from "@react-hooks-library/core";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function CollectionCard({
  typeface,
  index,
  showContent,
}: {
  typeface: typeface;
  index: number;
  showContent: boolean;
}) {
  const [isMouseHover, setIsMouseHover] = useState<boolean>(false);

  const fontFamily = slugify(typeface.name);

  const { loaded, error, font } = useFont(fontFamily, typeface.varFont);

  if (error) {
    return <div>Error loading font</div>;
  }

  if (!loaded) {
    return <div>Loading font</div>;
  }

  return (
    <motion.div
      className="relative"
      key={typeface.slug}
      onMouseOver={() => setIsMouseHover(true)}
      onFocus={() => setIsMouseHover(true)}
      onMouseOut={() => setIsMouseHover(false)}
      onBlur={() => setIsMouseHover(false)}
      initial={{ y: 50, opacity: 0 }}
      animate={{
        y: showContent ? 0 : 50,
        opacity: showContent ? 1 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3 + index * 0.15,
      }}
    >
      <Link
        href={`/collection/${typeface.slug}`}
        aria-label={typeface.name}
        className="relative flex justify-between items-center text-white"
      >
        {/* Collection name */}
        <h3
          className="text-[8vw] transition-all duration-300 ease-in-out"
          style={{
            fontFamily: fontFamily,
            fontVariationSettings: `'wght' ${isMouseHover ? 900 : 400}, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
            paddingLeft: isMouseHover ? "80px" : 0,
          }}
        >
          {typeface.name}
        </h3>

        {/* Font count and axis info */}
        <div
          className="text-lg font-normal font-whisper transition-alll duration-300 ease-in-out"
          style={{
            paddingRight: isMouseHover ? "80px" : 0,
          }}
        >
          <div className="mb-1">{typeface.singleFontList.length} fonts</div>
          <div>{typeface.category}</div>
        </div>
      </Link>
    </motion.div>
  );
}
