"use client";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { useShopStore } from "@/states/shop";
import { typeface } from "@/types/typefaces";
import Shop from "@/ui/segments/collection/shop";
import { AnimatePresence, motion } from "framer-motion";
import CloseButton from "./close-button";

interface ShopButtonProps {
  content: typeface;
}

export default function ShopButton({ content }: ShopButtonProps) {
  const { shopOpen, setShopOpen } = useShopStore();

  // Block page scrolling when shop is open
  useScrollBlock(shopOpen);

  const handleShopClose = () => {
    setShopOpen(false);
  };

  return (
    <motion.nav
      className="fixed right-20 top-4 z-50"
      animate={{
        width: shopOpen ? "100vw" : "46px",
        height: shopOpen ? "100vh" : "46px",
        right: shopOpen ? 0 : "80px",
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
        {!shopOpen && (
          <span className="text-sm font-medium font-whisper">Buy</span>
        )}
      </motion.button>

      {/* Shop Content - Only appears after expansion */}
      <AnimatePresence>
        {shopOpen && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-white bg-black p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <Shop content={content} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Shop - Only visible when expanded */}
      <AnimatePresence>
        {shopOpen && <CloseButton onClick={handleShopClose} />}
      </AnimatePresence>
    </motion.nav>
  );
}
