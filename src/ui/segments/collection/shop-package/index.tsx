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
      price: "$59",
      fonts: [
        { weight: "Thin", italic: "Thin Italic" },
        { weight: "Light", italic: "Light Italic" },
        { weight: "Regular", italic: "Regular Italic" },
        { weight: "Medium", italic: "Medium Italic" },
        { weight: "Semibold", italic: "Semibold Italic" },
      ],
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
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] w-[100vw] flex bg-[#eaeaea]"
    >
      {packages.map((pkg, i) => {
        const isHovered = hoveredPackage === pkg.key;
        const width = isHovered ? "60vw" : "20vw";

        return (
          <motion.div
            key={pkg.key}
            initial={{ y: 500, opacity: 1 }}
            whileInView={{ y: 0, opacity: 1 }}
            exit={{ y: 500, opacity: 1 }}
            transition={{
              delay: i * 0.2, // 0s, 0.2s, 0.4s delays
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            viewport={{ once: false, margin: "-100px" }}
            style={{ width: hoveredPackage ? width : "33.33vw" }}
            className="group relative h-[80vh] bg-black text-white overflow-hidden p-6 transition-all duration-500 ease-out rounded-2xl mx-2"
            onMouseEnter={() => setHoveredPackage(pkg.key)}
            onMouseLeave={() => setHoveredPackage(null)}
          >
            {/* Default State - Top Aligned */}
            <div className="relative h-full flex flex-col justify-start -mt-[60px]">
              {/* Large Package Letter and Price - Top Left */}
              <div className="relative flex items-baseline gap-4">
                <div className="text-[20vw] leading-none font-black select-none">
                  {pkg.key}
                </div>
                {/* Price that slides in from bottom on hover */}
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : "100%",
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative flex items-baseline gap-2 -mt-[30px]"
                >
                  {/* Dollar sign in circular container */}
                  <div className="relative -top-[146px] border border-solid border-white rounded-full w-20 h-20 flex items-center justify-center">
                    <span className="text-[68px] font-normal text-white">
                      $
                    </span>
                  </div>
                  {/* Price number */}
                  <span className="text-[20vw] font-bold text-white leading-none">
                    {pkg.price.replace("$", "")}
                  </span>
                </motion.div>
              </div>

              {/* Package Name - Below Letter */}
              <div className="text-6xl font-normal font-sans">{pkg.name}</div>
            </div>
            {/* Buy Button - Lower Right */}
            {isHovered && (
              <div className="absolute bottom-1 right-10">
                <button className="bg-transparent text-white font-semibold text-6xl rounded-[80px] px-16 py-8 border-4 border-white hover:bg-white hover:text-black transition-colors duration-300">
                  Buy
                </button>
              </div>
            )}

            {/* Hover State - Font List Slides In from Bottom */}
            {isHovered && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute bottom-0 left-0 w-full bg-black/90 p-6 rounded-b-2xl"
              >
                <div className="space-y-2">
                  {pkg.fonts.map((font, index) => (
                    <motion.div
                      key={font.weight}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="flex text-[20px] text-white font-normal font-sans"
                    >
                      <span className="font-normal w-40">{font.weight}</span>
                      <span className="font-italic w-40">{font.italic}</span>
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
