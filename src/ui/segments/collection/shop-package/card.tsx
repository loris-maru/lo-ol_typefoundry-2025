import { motion } from "framer-motion";

import { Package } from "@/app/content/PACKAGES";
import { useShopStore } from "@/states/shop";
import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";

export type PackageCardType = {
  content: typeface;
  isInView: boolean;
  pkg: Package;
  videoUrl: string;
  idx: number;
  isHovered: boolean;
  onHoverChange: (isHovered: boolean) => void;
  animationPhase: "stack" | "spread";
};

export default function PackageCard({
  content,
  isInView,
  pkg,
  idx,
  videoUrl,
  isHovered,
  onHoverChange,
  animationPhase,
}: PackageCardType) {
  const { setShopOpen } = useShopStore();

  const handleBuyClick = () => {
    setShopOpen(true);
  };

  const fontFamily = slugify(content.name);

  // Stack positions - cards stacked on top of each other with slight rotation
  const getStackPosition = () => {
    const baseRotation = idx * 3; // 0°, 3°, 6° rotation
    const baseY = idx * 12; // 0px, 12px, 24px offset
    // Central card (idx 0) should be in front when they arrive
    const baseZ = idx === 0 ? 10 : idx * 2; // Center card gets highest z-index

    return {
      rotation: baseRotation,
      y: baseY,
      zIndex: baseZ,
    };
  };

  // Spread positions - cards spread out with reduced rotation and more translation
  const getSpreadPosition = () => {
    if (idx === 0) return { x: 0, rotation: 0 }; // Center card stays straight
    if (idx === 1) return { x: -400, rotation: -10 }; // Left card moves far left
    if (idx === 2) return { x: 400, rotation: 10 }; // Right card moves far right
    return { x: 0, rotation: 0 };
  };

  const stackPos = getStackPosition();
  const spreadPos = getSpreadPosition();

  return (
    <motion.div
      className={`absolute h-[65vh] w-[25.5vw] overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-in-out ${
        isHovered ? "border-transparent" : "border-black"
      }`}
      style={{
        backgroundColor: isHovered ? "transparent" : "#ECECEC",
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      initial={{
        y: 800, // Start from way below screen
        opacity: 0,
        rotate: 0,
        x: 0,
      }}
      animate={{
        y: isInView ? (animationPhase === "stack" ? stackPos.y : 0) : 800,
        opacity: isInView ? 1 : 0,
        rotate: isInView
          ? animationPhase === "stack"
            ? stackPos.rotation
            : spreadPos.rotation
          : 0,
        x: isInView ? (animationPhase === "spread" ? spreadPos.x : 0) : 0,
        scale: isHovered ? 1.05 : 1,
        zIndex: isHovered ? 20 : animationPhase === "stack" ? stackPos.zIndex : idx === 0 ? 15 : 5,
      }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
        delay: idx * 0.15, // Staggered entry: 0s, 0.15s, 0.3s
      }}
    >
      {/* Video Background - only plays on hover */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <video
          src={videoUrl}
          ref={(el) => {
            if (el) {
              if (isHovered) {
                el.play();
              } else {
                el.pause();
              }
            }
          }}
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      {/* Background - slides up on hover to reveal video */}
      <motion.div
        className="absolute inset-0 z-10 transition-all duration-500 ease-in-out"
        style={{ backgroundColor: "#ECECEC" }}
        animate={{
          y: isHovered ? "-100%" : "0%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Content Container */}
      <div
        className={`relative z-20 flex h-full flex-col justify-between px-6 py-4 text-left transition-colors duration-300 ${
          isHovered ? "text-white" : "text-black"
        }`}
        style={{
          transitionDelay: isHovered ? "700ms" : "0ms",
        }}
      >
        {/* Top Section - Package Abbreviation and Full Name */}
        <div>
          <div
            className="text-[6vw] leading-none transition-all duration-300 ease-in-out"
            style={{
              fontFamily: fontFamily,
              fontVariationSettings: `'wght' ${isHovered ? 900 : 400}, 'wdth' 900`,
            }}
          >
            {pkg.key}
          </div>
          <div
            className={`text-3xl font-bold transition-colors duration-300 ${
              isHovered ? "text-white" : "text-black"
            }`}
            style={{
              fontFamily: fontFamily,
              transitionDelay: isHovered ? "700ms" : "0ms",
            }}
          >
            {pkg.key === "La" ? "Large" : pkg.key === "Me" ? "Medium" : "Small"}
          </div>
        </div>

        {/* Bottom Section - Price and Font List (Hidden by default, shown on hover) */}
        {isHovered && (
          <motion.div
            className="z-[100] flex h-[50%] flex-col justify-between space-y-4 pt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Font List Container */}
            <div>
              <div className="font-whisper text-sm leading-[1.6] font-normal">
                {pkg.fonts.map((font, index) => (
                  <span key={font.weight}>
                    {font.weight}, {font.italic}
                    {index < pkg.fonts.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Price and Buy Button */}
            <div className="flex flex-row items-center justify-between">
              <div
                className="text-3xl font-bold"
                style={{
                  fontFamily: fontFamily,
                  fontVariationSettings: `'wdth' 900`,
                }}
              >
                {pkg.price}
              </div>
              <button
                type="button"
                onClick={handleBuyClick}
                className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition-colors duration-300 ${
                  isHovered
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
