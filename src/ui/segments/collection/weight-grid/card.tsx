import { WeightDef } from "@/app/content/WEIGHTS-LIST";
import { typeface } from "@/types/typefaces";
import { cn } from "@/utils/classNames";
import slugify from "@/utils/slugify";
import { motion } from "framer-motion";
import { useState } from "react";
import ButtonScript from "./button-script";
import OpticalSizeSlider from "./sliders/optical-size";
import SlantSlider from "./sliders/slant";
import WidthSlider from "./sliders/width";

export default function WeightCard({
  card,
  content,
  hasWidth,
  onMouseEnter,
  onMouseLeave,
  familyAbbreviation,
  idx,
}: {
  card: WeightDef;
  content: typeface;
  hasWidth: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  familyAbbreviation: string;
  idx: number;
}) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [widthValue, setWidthValue] = useState<number>(100);
  const [opticalSizeValue, setOpticalSizeValue] = useState<number>(100);
  const [slantValue, setSlantValue] = useState<number>(0);
  const [script, setScript] = useState<"latin" | "hangul">("latin");

  const widthSettings = {
    min: 100,
    max: 900,
    step: 1,
    value: 100,
  };

  const opticalSizeSettings = {
    min: 100,
    max: 900,
    step: 1,
    value: 100,
  };

  const slantSettings = {
    min: 0,
    max: 90,
    step: 1,
    value: 0,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave();
  };

  const fontName = slugify(content.name);

  return (
    <div
      className="relative overflow-hidden p-6 border border-solid border-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card surface */}
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] bg-black transition-colors duration-300 ease-linear" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between text-white">
        <div>
          <div className="w-full flex flex-row gap-x-2">
            <div
              className="text-6xl w-36 h-36 rounded-full border border-solid border-white flex items-center justify-center"
              style={{
                fontFamily: fontName,
                fontVariationSettings: `'wght' ${card.value}, 'wdth' ${
                  content.has_wdth ? widthValue : 900
                }, 'opsz' ${
                  content.has_opsz ? opticalSizeValue : 900
                }, 'slnt' ${content.has_slnt ? slantValue : 0} `,
              }}
            >
              {card.abbr}
            </div>
            <div
              className="text-6xl w-36 h-36 rounded-full bg-white text-black flex items-center justify-center"
              style={{
                fontFamily: fontName,
                fontVariationSettings: `'wght' ${card.value}, 'wdth' ${
                  content.has_wdth ? widthValue : 900
                }, 'opsz' ${
                  content.has_opsz ? opticalSizeValue : 900
                }, 'slnt' ${content.has_slnt ? slantValue : 0} `,
              }}
            >
              {familyAbbreviation}
            </div>
          </div>

          {/* Weight Name and Value - Only visible on hover with slide-in animations */}
          {isHovered && (
            <div className="relative -top-4 text-[5.5vw] whitespace-nowrap overflow-hidden">
              {/* Weight Name - Slides in first */}
              <motion.span
                className={cn(
                  "inline-block mr-6",
                  script === "latin" ? "text-[7.6vw]" : "text-[5.5vw]"
                )}
                style={{
                  fontFamily: fontName,
                  fontVariationSettings: `'wght' ${card.value}, 'wdth' ${
                    content.has_wdth ? widthValue : 900
                  }, 'opsz' ${
                    content.has_opsz ? opticalSizeValue : 900
                  }, 'slnt' ${content.has_slnt ? slantValue : 0} `,
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {content.hasHangul
                  ? script === "latin"
                    ? card.name
                    : card.hangul
                  : card.name}
              </motion.span>

              {/* Weight Value - Slides in second with delay */}
              <motion.span
                className={cn(
                  script === "latin" ? "text-[7.6vw]" : "text-[5.5vw]"
                )}
                style={{
                  fontFamily: fontName,
                  fontVariationSettings: `'wght' ${card.value}, 'wdth' ${
                    content.has_wdth ? widthValue : 900
                  }, 'opsz' ${
                    content.has_opsz ? opticalSizeValue : 900
                  }, 'slnt' ${content.has_slnt ? slantValue : 0} `,
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              >
                {card.value}
              </motion.span>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="text-base font-medium">#{idx + 1}</div>

          {/* Width Slider - Only visible on hover */}
          {isHovered && content.has_wdth && (
            <WidthSlider
              widthValue={widthValue}
              setWidthValue={setWidthValue}
              widthSettings={widthSettings}
            />
          )}
          {isHovered && content.has_opsz && (
            <OpticalSizeSlider
              opticalSizeValue={opticalSizeValue}
              setOpticalSizeValue={setOpticalSizeValue}
              opticalSizeSettings={opticalSizeSettings}
            />
          )}
          {isHovered && content.has_slnt && (
            <SlantSlider
              slantValue={slantValue}
              setSlantValue={setSlantValue}
              slantSettings={slantSettings}
            />
          )}
          {isHovered && content.hasHangul && (
            <ButtonScript activeScript={script} setActiveScript={setScript} />
          )}
        </div>
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-custom::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        .slider-custom::-webkit-slider-track {
          background: white;
          border-radius: 9999px;
          height: 2px;
        }

        .slider-custom::-moz-range-track {
          background: white;
          border-radius: 9999px;
          height: 2px;
        }
      `}</style>
    </div>
  );
}
