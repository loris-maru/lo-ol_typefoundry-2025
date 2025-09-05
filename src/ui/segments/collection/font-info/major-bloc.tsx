import { useState } from "react";

import { motion } from "framer-motion";

import { SmallLink } from "@/ui/molecules/global/links";

import { BlockContent } from ".";

export default function MajorBlock({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  subtitle: string;
  description: BlockContent[];
  hasButton: boolean;
  label?: string;
}) {
  const [mouseHover, setMouseHover] = useState<boolean>(false);

  return (
    <div
      onMouseOver={() => setMouseHover(true)}
      onFocus={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
      onBlur={() => setMouseHover(false)}
      className="font-whisper relative z-30 flex h-1/3 w-full flex-row justify-between p-8"
    >
      <motion.div
        style={{
          color: mouseHover ? "white" : "black",
        }}
        className="flex w-[30vw] origin-top-left flex-row gap-6 text-4xl leading-[1] font-medium transition-all duration-200 ease-in-out"
      >
        <div>0{index + 1}.</div>
        <h3>{title}</h3>
      </motion.div>
      <div
        className="relative flex w-[60vw] flex-row justify-end gap-4 text-base text-white transition-opacity duration-100 ease-linear"
        style={{
          opacity: mouseHover ? 1 : 0,
        }}
      >
        {description.map((item: BlockContent, index: number) => (
          <div className="flex w-1/2 flex-col items-start" key={`${index}-${item.title}`}>
            <h4>{item.title}</h4>
            <div className="my-2 h-px w-10 bg-white" />
            <p className="mb-4 line-clamp-4">{item.description}</p>
            {item.label && <SmallLink label={item.label} link={item.link || ""} />}
          </div>
        ))}
      </div>
    </div>
  );
}
