import { Package } from "@/app/content/PACKAGES";
import { motion } from "framer-motion";

export type PackageCardType = {
  isInView: boolean;
  pkg: Package;
  idx: number;
};

export default function PackageCard({ isInView, pkg, idx }: PackageCardType) {
  return (
    <div className="relative flex-1 h-full">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
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
        className="absolute inset-0 bg-black z-50"
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

        {/* Bottom Section - Price and Font List */}
        <div className="space-y-6">
          {/* Font List Container */}
          <div className="flex flex-row max-h-48 overflow-y-auto">
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
                  className="flex text-sm text-white font-normal font-sans"
                >
                  <span className="block w-24 font-medium">{font.weight}</span>
                  <span className="font-light italic">{font.italic}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Price */}
          <div>
            <div className="text-6xl font-bold font-sans">{pkg.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
