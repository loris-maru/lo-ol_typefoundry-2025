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
};

export default function PackageCard({
  content,
  isInView,
  pkg,
  idx,
  videoUrl,
  isHovered,
  onHoverChange,
}: PackageCardType) {
  const { setShopOpen } = useShopStore();

  const handleBuyClick = () => {
    setShopOpen(true);
  };

  const fontFamily = slugify(content.name);

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl transition-all duration-500 ease-in-out"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      initial={{
        y: 500, // Start from much lower position (bottom)
        opacity: 0,
      }}
      animate={{
        y: isInView ? 0 : 500, // Slide in from much lower position when in view
        opacity: isInView ? 1 : 0,
        width: isHovered ? "120%" : "100%",
        height: isInView ? "100%" : "30%",
        zIndex: isHovered ? 10 : 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: idx * 0.2, // Staggered animation: first card (0s), second (0.2s), third (0.4s)
      }}
    >
      {/* Video Background */}
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

        {/* Blur Effect - dissolves on hover */}
        <motion.div
          className="absolute inset-0 bg-black/10"
          animate={{
            opacity: isHovered ? 0 : 1,
            backdropFilter: isHovered ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Black Overlay Container */}
      <motion.div
        className="absolute inset-0 z-10 bg-black"
        initial={{ y: 0 }}
        animate={{
          y: isInView ? "100%" : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay: idx * 0.2, // Staggered animation: left to right
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 flex h-full flex-col justify-between px-6 py-3 text-left text-white">
        {/* Top Section - Package Abbreviation */}
        <div>
          <div
            className="text-[10vw] leading-none transition-all duration-300 ease-in-out"
            style={{
              fontFamily: fontFamily,
              fontVariationSettings: `'wght' ${isHovered ? 900 : 300}, 'wdth' 900`,
            }}
          >
            {pkg.key}
          </div>
        </div>

        {/* Bottom Section - Price and Font List (Hidden by default, shown on hover) */}
        {isHovered && (
          <motion.div
            className="z-[100] flex h-[50%] flex-col justify-between space-y-6 pt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Font List Container */}
            <div>
              <div className="font-whisper text-base leading-[1.6] font-normal text-white">
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
                className="text-5xl font-bold"
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
                className="rounded-full border-1 border-white px-10 py-4 text-xl font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Overlay - Grows to 50vh on hover, positioned behind content */}
      <motion.div
        className="absolute right-0 bottom-0 left-0 z-15 bg-black"
        initial={{ height: 0 }}
        animate={{ height: isHovered ? "50%" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
