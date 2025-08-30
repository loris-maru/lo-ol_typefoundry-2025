"use client";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { useMenuStore } from "@/states/menu";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import CloseButton from "./close-button";

export default function MenuButton() {
  const { menuOpen, setMenuOpen } = useMenuStore();

  // Block page scrolling when menu is open
  useScrollBlock(menuOpen);

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
            className="absolute inset-0 flex items-center justify-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <div className="text-center space-y-8">
              <h1 className="text-6xl font-bold font-fuzar">Menu</h1>
              <div className="space-y-4 text-xl">
                <div className="hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  About
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  Contact
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors duration-200">
                  Documentation
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Menu - Positioned at same location as shop close button */}
      <AnimatePresence>
        {menuOpen && (
          <CloseButton
            onClick={handleClose}
            className="bg-white text-black hover:bg-gray-100"
            zIndex={70}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
