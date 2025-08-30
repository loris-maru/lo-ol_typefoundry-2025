import { Package } from "@/app/content/PACKAGES";
import { useShopStore } from "@/states/shop";
import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { motion } from "framer-motion";

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
      className="relative w-full h-full rounded-2xl overflow-hidden"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      animate={{
        width: isHovered ? "120%" : "100%",
        zIndex: isHovered ? 10 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Video Background */}
      <div className="absolute z-0 inset-0 w-full h-full">
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
          className="w-full h-full object-cover"
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
        className="absolute inset-0 bg-black z-10"
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
      <div className="relative z-20 h-full flex flex-col justify-between py-3 px-6 text-white text-left">
        {/* Top Section - Package Abbreviation */}
        <div>
          <div
            className="text-[14vw] leading-none transition-all duration-300 ease-in-out"
            style={{
              fontFamily: fontFamily,
              fontVariationSettings: `'wght' ${
                isHovered ? 900 : 300
              }, 'wdth' 900`,
            }}
          >
            {pkg.key}
          </div>
        </div>

        {/* Bottom Section - Price and Font List (Hidden by default, shown on hover) */}
        {isHovered && (
          <motion.div
            className="space-y-6 z-[100] flex flex-col justify-between h-[50%] pt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Font List Container */}
            <div>
              <div className="text-base text-white font-normal font-whisper leading-[1.6]">
                {pkg.fonts.map((font, index) => (
                  <span key={font.weight}>
                    {font.weight}, {font.italic}
                    {index < pkg.fonts.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Price and Buy Button */}
            <div className="flex flex-row justify-between items-center">
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
                className="text-white border-1 border-white rounded-full px-10 py-4 text-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Overlay - Grows to 50vh on hover, positioned behind content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black z-15"
        initial={{ height: 0 }}
        animate={{ height: isHovered ? "50%" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
