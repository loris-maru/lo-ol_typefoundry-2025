"use client";

import { useMenuStore } from "@/states/menu";
import { useShopStore } from "@/states/shop";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import Shop from "../collection/shop";

export default function Navigation() {
  const { menuOpen, setMenuOpen } = useMenuStore();
  const { shopOpen, setShopOpen } = useShopStore();

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleShopClose = () => {
    setShopOpen(false);
  };

  return (
    <>
      {/* Buy Button Container - Expands to 100vw x 100vh */}
      <motion.nav
        className="fixed right-4 top-4 z-50"
        animate={{
          width: shopOpen ? "100vw" : "46px",
          height: shopOpen ? "100vh" : "46px",
          right: shopOpen ? 0 : "16px",
          top: shopOpen ? 0 : "16px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.button
          onClick={() => setShopOpen(true)}
          className="w-full h-full rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
          animate={{
            borderRadius: shopOpen ? "0px" : "9999px",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {!shopOpen && <span className="text-sm font-medium">Buy</span>}
        </motion.button>

        {/* Shop Content - Only appears after expansion */}
        <AnimatePresence>
          {shopOpen && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-black bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <Shop />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button for Shop - Only visible when expanded */}
        <AnimatePresence>
          {shopOpen && (
            <motion.button
              onClick={handleShopClose}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Menu Button Container - Expands to 100vw x 100vh */}
      <motion.nav
        className="fixed right-20 top-4 z-50"
        animate={{
          width: menuOpen ? "100vw" : "46px",
          height: menuOpen ? "100vh" : "46px",
          right: menuOpen ? 0 : "80px",
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
      </motion.nav>

      {/* Close Button for Menu - Positioned at same location as shop close button */}
      <AnimatePresence>
        {menuOpen && (
          <motion.button
            onClick={handleClose}
            className="fixed top-6 right-6 z-[70] w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
