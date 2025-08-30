import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
      className="relative z-30 w-full h-1/3 flex flex-row justify-between p-8 font-whisper"
    >
      <motion.div
        style={{
          color: mouseHover ? "white" : "black",
        }}
        className="w-[40vw] flex flex-row gap-6 font-medium transition-all text-5xl duration-200 ease-in-out leading-[1] origin-top-left"
      >
        <div>0{index + 1}.</div>
        <h3>{title}</h3>
      </motion.div>
      <div
        className="relative w-[40vw] flex flex-row gap-4 text-base text-white transition-opacity duration-100 ease-linear"
        style={{
          opacity: mouseHover ? 1 : 0,
        }}
      >
        {description.map((item: BlockContent, index: number) => (
          <div className="flex flex-col items-start" key={index}>
            <h4>{item.title}</h4>
            <div className="w-10 h-px bg-white my-2" />
            <p className="line-clamp-4">{item.description}</p>
            {item.label && (
              <Link
                className="relative mt-2 px-8 py-2 border border-solid border-white rounded-full text-base transition-colors duration-300 ease-in-out hover:bg-black hover:text-white"
                href={item.link || ""}
              >
                <span className="relative top-0.5 inline-block">
                  {item.label}
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
