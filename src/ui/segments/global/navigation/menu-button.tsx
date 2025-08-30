"use client";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { useMenuStore } from "@/states/menu";
import { typeface } from "@/types/typefaces";
import CollectionLink from "@/ui/molecules/global/collection-link";
import { MediumLink } from "@/ui/molecules/global/links";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import CloseButton from "./close-button";

export default function MenuButton({
  allTypefaces,
}: {
  allTypefaces: typeface[];
}) {
  const { menuOpen, setMenuOpen } = useMenuStore();
  const [mouseY, setMouseY] = useState(0);

  // Block page scrolling when menu is open
  useScrollBlock(menuOpen);

  // Track mouse Y position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    if (menuOpen) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [menuOpen]);

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed right-36 top-4 z-50"
      animate={{
        width: menuOpen ? "100vw" : "46px",
        height: menuOpen ? "100vh" : "46px",
        right: menuOpen ? 0 : "144px",
        top: menuOpen ? 0 : "16px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        zIndex: menuOpen ? 60 : 50, // Menu above shop when open
      }}
    >
      <motion.button
        onClick={handleMenuClick}
        className="w-full h-full rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
        animate={{
          borderRadius: menuOpen ? "0px" : "9999px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!menuOpen && <FiMenu className="h-5 w-5" />}
      </motion.button>

      {/* Menu Content - Only appears after expansion */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex flex-row p-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <div
              id="collection-links-list"
              className="relative w-3/4 flex flex-col gap-y-5 text-xl text-white pr-8"
            >
              {allTypefaces.map((typeface: typeface) => (
                <div key={typeface.slug}>
                  <CollectionLink
                    link={`/collection/${typeface.slug}`}
                    label={typeface.name}
                    category={typeface.category}
                    fontsNumber={typeface.singleFontList.length}
                  />
                </div>
              ))}
              <div
                id="single-font-background-container"
                className="absolute -left-4 z-30 w-full h-12 rounded-full bg-white mix-blend-difference transition-transform duration-75 ease-out pointer-none:"
                style={{
                  transform: `translateY(${mouseY - 82}px)`, // Center the div on mouse Y position (24px = half of h-12)
                }}
              />
            </div>
            <div className="relative w-1/4 flex flex-col text-xl text-white">
              <MediumLink link="/about" label="About" />
              <MediumLink link="/license" label="License" />
              <MediumLink link="/the-lab" label="The Lab" />
              <MediumLink link="/hangeul" label="Hangeul" />
              <MediumLink link="/contact" label="Contact" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Menu - Positioned at same location as shop close button */}
      <AnimatePresence>
        {menuOpen && (
          <CloseButton
            onClick={handleClose}
            className="bg-transparent text-white hover:bg-gray-100"
            zIndex={70}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
