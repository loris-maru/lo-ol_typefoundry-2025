import { WeightDef } from "@/app/content/WEIGHTS-LIST";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WeightCard({
  content,
  onMouseEnter,
  onMouseLeave,
  idx,
}: {
  content: WeightDef;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  idx: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [widthValue, setWidthValue] = useState(100);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave();
  };

  return (
    <div
      className="relative overflow-hidden p-6 border border-solid border-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card surface */}
      <div className="absolute inset-0 bg-black  shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between text-white">
        <div>
          <div className="w-full flex flex-row gap-x-2">
            <div
              className="text-6xl w-36 h-36 rounded-full border border-solid border-white flex items-center justify-center font-fuzar"
              style={{
                fontVariationSettings: `'wght' ${content.value}, 'wdth' ${widthValue}`,
              }}
            >
              {content.abbr}
            </div>
            <div
              className="text-6xl w-36 h-36 rounded-full bg-white text-black flex items-center justify-center font-fuzar"
              style={{
                fontVariationSettings: `'wght' ${content.value}, 'wdth' ${widthValue}`,
              }}
            >
              Fu
            </div>
          </div>

          {/* Weight Name and Value - Only visible on hover with slide-in animations */}
          {isHovered && (
            <div className="relative -top-4 text-[5.5vw] whitespace-nowrap overflow-hidden">
              {/* Weight Name - Slides in first */}
              <motion.span
                className="inline-block mr-6 font-fuzar text-[7.6vw]"
                style={{
                  fontVariationSettings: `'wght' ${content.value}, 'wdth' ${widthValue}`,
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {content.name}
              </motion.span>

              {/* Weight Value - Slides in second with delay */}
              <motion.span
                className="font-fuzar text-[7.6vw]"
                style={{
                  fontVariationSettings: `'wght' ${content.value}, 'wdth' ${widthValue}`,
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              >
                {content.value}
              </motion.span>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="text-base font-medium">#{idx + 1}</div>

          {/* Width Slider - Only visible on hover */}
          {isHovered && (
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm text-white/80">Width:</span>
              <input
                type="range"
                min="100"
                max="900"
                step="1"
                value={widthValue}
                onChange={(e) => setWidthValue(Number(e.target.value))}
                className="w-24 h-2 appearance-none bg-white/20 rounded-full slider-custom"
                aria-label="Width axis"
              />
              <span className="text-sm text-white/60 w-8 text-right">
                {widthValue}
              </span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-custom::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-custom::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          height: 8px;
        }

        .slider-custom::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          height: 8px;
        }
      `}</style>
    </div>
  );
}
