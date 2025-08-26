import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ShopPackages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.6, // Trigger when 60% of the section is visible
    once: false, // Allow multiple triggers
  });

  const packages = [
    {
      key: "S",
      name: "Small",
      price: "$59",
      fonts: [
        { weight: "Thin", italic: "Thin Italic" },
        { weight: "Light", italic: "Light Italic" },
        { weight: "Regular", italic: "Regular Italic" },
        { weight: "Medium", italic: "Medium Italic" },
        { weight: "Semibold", italic: "Semibold Italic" },
      ],
      videoBg: "/videos/small-package.mp4", // You'll need to add these video files
    },
    {
      key: "M",
      name: "Medium",
      price: "$119",
      fonts: [
        { weight: "Thin", italic: "Thin Italic" },
        { weight: "Light", italic: "Light Italic" },
        { weight: "Regular", italic: "Regular Italic" },
        { weight: "Medium", italic: "Medium Italic" },
        { weight: "Semibold", italic: "Semibold Italic" },
        { weight: "Bold", italic: "Bold Italic" },
        { weight: "ExtraBold", italic: "ExtraBold Italic" },
      ],
      videoBg: "/videos/medium-package.mp4",
    },
    {
      key: "L",
      name: "Large",
      price: "$199",
      fonts: [
        { weight: "Thin", italic: "Thin Italic" },
        { weight: "ExtraLight", italic: "ExtraLight Italic" },
        { weight: "Light", italic: "Light Italic" },
        { weight: "Regular", italic: "Regular Italic" },
        { weight: "Medium", italic: "Medium Italic" },
        { weight: "Semibold", italic: "Semibold Italic" },
        { weight: "Bold", italic: "Bold Italic" },
        { weight: "ExtraBold", italic: "ExtraBold Italic" },
        { weight: "Black", italic: "Black Italic" },
      ],
      videoBg: "/videos/large-package.mp4",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] w-[100vw] flex bg-[#eaeaea] overflow-hidden"
    >
      {packages.map((pkg, i) => (
        <div key={pkg.key} className="relative flex-1 h-full">
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
              delay: i * 0.2, // Staggered animation: left to right
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
                        delay: isInView ? i * 0.2 + index * 0.1 : 0,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      className="flex text-sm text-white font-normal font-sans"
                    >
                      <span className="block w-24 font-medium">
                        {font.weight}
                      </span>
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
      ))}
    </section>
  );
}
