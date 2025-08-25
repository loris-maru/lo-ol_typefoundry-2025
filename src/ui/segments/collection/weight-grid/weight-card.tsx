import { motion, MotionValue } from "framer-motion";
import React, { useCallback } from "react";

export type WeightDef = { name: string; value: number; abbr: string };

interface SingleWeightCardProps {
  weight: WeightDef;
  wdth: number;
  onWdthChange: (value: number) => void;
  isHovered: boolean;
  onHover: (isHovered: boolean) => void;
  width: string;
  height: string;
  scrollScale: MotionValue<number>;
}

const SingleWeightCard: React.FC<SingleWeightCardProps> = ({
  weight,
  wdth,
  onWdthChange,
  isHovered,
  onHover,
  width,
  height,
  scrollScale,
}) => {
  const unifiedFontSize = "clamp(96px, 4vh, 106px)";

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onWdthChange(Number(e.target.value)),
    [onWdthChange]
  );

  const handleMouseEnter = useCallback(() => onHover(true), [onHover]);
  const handleMouseLeave = useCallback(() => onHover(false), [onHover]);

  return (
    <motion.div
      className="relative overflow-hidden p-6 rounded-xl cursor-pointer"
      style={{
        backgroundColor: "#000",
        color: "#fff",
        width: width,
        height: height,
        fontSize: unifiedFontSize,
        fontFamily: "Fuzar, ui-sans-serif, system-ui",
        fontVariationSettings: `"wght" ${weight.value}, "wdth" 900`,
        transition: "all 600ms cubic-bezier(.2,.8,.2,1)",
        zIndex: isHovered ? 10 : 1,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition={{ duration: 600, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Badges row */}
      <div className="flex items-start gap-3">
        {/* Abbreviation circle */}
        <div
          className="inline-flex items-center justify-center rounded-full border border-white transition-all duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{
            width: isHovered ? 60 : 120,
            height: isHovered ? 60 : 120,
            padding: isHovered ? 8 : 16,
            lineHeight: 1,
            fontSize: isHovered ? 32 : 64,
            backgroundColor: "#000",
            fontFamily: "Fuzar, ui-sans-serif, system-ui",
            fontVariationSettings: `'wght' ${weight.value}, 'wdth' 900`,
          }}
        >
          {weight.abbr}
        </div>
        {/* Second 'Fu' circle - no border, white bg, black text */}
        <div
          className="inline-flex items-center justify-center rounded-full bg-white text-black transition-all duration-600 ease-[cubic-bezier(.2,.8,.2,1)]"
          style={{
            width: isHovered ? 60 : 120,
            height: isHovered ? 60 : 120,
            padding: isHovered ? 8 : 16,
            lineHeight: 1,
            fontSize: isHovered ? 32 : 64,
            fontFamily: "Fuzar, ui-sans-serif, system-ui",
            fontVariationSettings: `'wght' ${weight.value}, 'wdth' 900`,
          }}
        >
          Fu
        </div>
      </div>

      {/* Family + full weight name underneath - only visible on hover */}
      {isHovered && (
        <div className="mt-6">
          <div
            className="leading-[1.05]"
            style={{
              fontFamily: "Fuzar, ui-sans-serif, system-ui",
              fontVariationSettings: `'wght' ${weight.value}, 'wdth' ${wdth}`,
              fontSize: unifiedFontSize,
            }}
          >
            Fuzar
          </div>
          <div
            className="leading-[1.05] mt-[10px] flex items-center justify-between"
            style={{
              fontFamily: "Fuzar, ui-sans-serif, system-ui",
              fontVariationSettings: `'wght' ${weight.value}, 'wdth' ${wdth}`,
              fontSize: unifiedFontSize,
            }}
          >
            <span>{weight.name}</span>
            <span className="text-white text-lg font-normal font-sans ml-4">
              {weight.value}
            </span>
          </div>
        </div>
      )}

      {/* Footer: weight value + width slider - only visible on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute left-6 right-6 bottom-6 flex items-center justify-between gap-4"
        >
          {/* <div className="leading-none" style={{ fontSize: unifiedFontSize }}>
            {weight.value}
          </div> */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-normal font-sans">
              Width
            </span>
            <input
              type="range"
              min={75}
              max={125}
              step={1}
              value={wdth}
              onChange={handleWidthChange}
              className="w-44 h-4 appearance-none bg-transparent slider-wdth-white"
              aria-label="Width axis"
            />
          </div>
        </motion.div>
      )}

      {/* Weight value - only visible when not hovered, positioned bottom left */}
      {!isHovered && (
        <div className="absolute bottom-6 left-6">
          <div
            className="text-white text-lg font-normal font-sans"
            style={{ fontSize: "clamp(16px, 2vh, 20px)" }}
          >
            {weight.value}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(SingleWeightCard);
