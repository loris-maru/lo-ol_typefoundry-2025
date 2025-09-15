import { MotionValue, motion } from "motion/react";

import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export default function TypeTesterCustomise({
  content,
  height,
}: {
  content: typeface;
  height: MotionValue<string>;
}) {
  return (
    <motion.div
      id="type-tester-customise-container"
      className="relative flex w-full items-center justify-center overflow-hidden bg-[#A8E2FB]"
      style={{
        height,
        transformOrigin: "center center", // Resize from center
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <h2
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[9vw] leading-none font-black text-black"
        style={{
          fontFamily: slugify(content.name),
          fontVariationSettings: `'wght' 900, 'wdth' 900, 'opsz' 900, 'slnt' 0`,
        }}
      >
        Customize
        <br />
        {content.name}
      </h2>
    </motion.div>
  );
}
