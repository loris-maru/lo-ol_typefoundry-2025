import { Package } from "@/app/content/PACKAGES";
import { useShopStore } from "@/states/shop";
import { motion } from "framer-motion";
import { useState } from "react";

export type PackageCardType = {
  isInView: boolean;
  pkg: Package;
  idx: number;
};

export default function PackageCard({ isInView, pkg, idx }: PackageCardType) {
  const [isHovered, setIsHovered] = useState(false);
  const { setShopOpen } = useShopStore();

  const handleBuyClick = () => {
    setShopOpen(true);
  };

  return (
    <div
      className="relative flex-1 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Background */}
      <div className="absolute z-0 inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={pkg.videoBg} type="video/mp4" />
          {/* Fallback background color if video fails to load */}
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900" />
        </video>
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
          <div className="text-[24vw] leading-none font-black font-fuzar">
            {pkg.key}
          </div>
          {/* Middle Section - Package Full Name */}
          <div>
            <div className="relative -top-10 text-6xl font-normal font-sans">
              {pkg.name}
            </div>
          </div>
        </div>

        {/* Bottom Section - Price and Font List (Hidden by default, shown on hover) */}
        {isHovered && (
          <motion.div
            className="space-y-6 z-[100]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Font List Container */}
            <div>
              <div className="space-y-2">
                {pkg.fonts.map((font, index) => (
                  <motion.div
                    key={font.weight}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      y: isInView ? 0 : 10,
                    }}
                    transition={{
                      delay: isInView ? idx * 0.2 + index * 0.1 : 0,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className="flex justify-between text-sm text-white font-normal font-sans"
                  >
                    <span className="font-medium">{font.weight}</span>
                    <span className="font-light italic">{font.italic}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Price and Buy Button */}
            <div className="flex flex-row justify-between items-baseline">
              <div className="text-6xl font-bold font-sans">{pkg.price}</div>
              <button
                type="button"
                onClick={handleBuyClick}
                className="text-white border-2 border-white rounded-full px-10 py-4 text-xl font-semibold hover:bg-white hover:text-black transition-colors duration-300"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hover Overlay - Grows to 50vh on hover, positioned behind content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black/90 z-15"
        initial={{ height: 0 }}
        animate={{ height: isHovered ? "50vh" : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}
