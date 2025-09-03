"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useScrollBlock } from "@/hooks/useScrollBlock";
import { useShopStore } from "@/states/shop";
import { typeface } from "@/types/typefaces";
import Shop from "@/ui/segments/collection/shop";

import CloseButton from "./close-button";

interface ShopButtonProps {
  content: typeface;
}

export default function ShopButton({ content }: ShopButtonProps) {
  const { shopOpen, setShopOpen } = useShopStore();
  const [isHovered, setIsHovered] = useState(false);

  // Block page scrolling when shop is open
  useScrollBlock(shopOpen);

  const handleShopClose = () => {
    setShopOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-4 right-20 z-[60]"
      animate={{
        width: shopOpen ? "100vw" : isHovered ? "168px" : "64px",
        height: shopOpen ? "100vh" : "64px",
        right: shopOpen ? 0 : "100px",
        top: shopOpen ? 0 : "16px",
      }}
      transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
    >
      <motion.button
        onClick={() => setShopOpen(true)}
        onMouseEnter={() => !shopOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex h-full w-full items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-gray-800"
        animate={{
          borderRadius: shopOpen ? "0px" : "9999px",
        }}
        transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
      >
        {!shopOpen && (
          <div className="flex w-full items-center justify-center gap-1">
            <motion.span
              className="font-whisper text-sm font-medium"
              animate={{
                opacity: 1,
              }}
              transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              Buy
            </motion.span>
            <motion.span
              className="font-whisper text-sm font-medium"
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20,
                width: isHovered ? "auto" : 0,
              }}
              transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              fonts
            </motion.span>
          </div>
        )}
      </motion.button>

      {/* Shop Content - Only appears after expansion */}
      <AnimatePresence>
        {shopOpen && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black p-12 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <motion.h1
              className="font-whisper mb-8 text-2xl font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              Buy fonts
            </motion.h1>
            <Shop content={content} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button for Shop - Only visible when expanded */}
      <AnimatePresence>
        {shopOpen && <CloseButton onClick={handleShopClose} zIndex={70} />}
      </AnimatePresence>
    </motion.nav>
  );
}
