import { motion, useScroll } from "framer-motion";
import { useRef, useState } from "react";

export default function ShopPackages() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const packages = [
    {
      key: "S",
      name: "Small",
      fonts: ["Thin", "Light", "Regular", "Medium", "Semibold"],
    },
    {
      key: "M",
      name: "Medium",
      fonts: [
        "Thin",
        "Light",
        "Regular",
        "Medium",
        "Semibold",
        "Bold",
        "ExtraBold",
      ],
    },
    {
      key: "L",
      name: "Large",
      fonts: [
        "Thin",
        "ExtraLight",
        "Light",
        "Regular",
        "Medium",
        "Semibold",
        "Bold",
        "ExtraBold",
        "Black",
      ],
    },
  ];

  return (
    <section ref={sectionRef} className="relative h-[100vh] w-[100vw] flex">
      {packages.map((pkg, i) => {
        const isHovered = hoveredPackage === pkg.key;
        const width = isHovered ? "60vw" : "20vw";

        return (
          <motion.div
            key={pkg.key}
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              delay: i * 0.2, // 0s, 0.2s, 0.4s delays
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ width: hoveredPackage ? width : "33.33vw" }}
            className="group relative h-full bg-black text-white overflow-hidden p-6 transition-all duration-500 ease-out"
            onMouseEnter={() => setHoveredPackage(pkg.key)}
            onMouseLeave={() => setHoveredPackage(null)}
          >
            {/* Default State - Top Aligned */}
            <div className="h-full flex flex-col justify-start pt-6">
              {/* Large Package Letter - Top Left */}
              <div className="text-[20vw] leading-none font-black select-none mb-4">
                {pkg.key}
              </div>

              {/* Package Name - Below Letter */}
              <div className="text-2xl font-normal font-sans">{pkg.name}</div>
            </div>

            {/* Hover State - Font List Slides In from Left */}
            {isHovered && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 left-0 w-full bg-black/90 p-6"
              >
                <div className="space-y-2">
                  {pkg.fonts.map((font, index) => (
                    <motion.div
                      key={font}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="text-[20px] text-white font-normal font-sans text-left"
                    >
                      {font}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
