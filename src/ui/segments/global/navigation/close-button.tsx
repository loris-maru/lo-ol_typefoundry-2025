"use client";

import { motion } from "framer-motion";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  zIndex?: number;
}

export default function CloseButton({
  onClick,
  className = "bg-black text-white hover:bg-gray-800",
  zIndex = 50,
}: CloseButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`absolute top-4 right-6 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 ${className}`}
      style={{ zIndex }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, delay: 0.3 }}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.button>
  );
}
