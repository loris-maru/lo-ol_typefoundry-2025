"use client";

import { motion } from "motion/react";
import { typeface } from "@/types/typefaces";

export type LoaderProps = {
  showLoader: boolean;
  content: typeface;
  fontLoaded: boolean;
  videoLoaded: boolean;
  progress: number;
};

export default function Loader({
  showLoader,
  content,
  fontLoaded,
  videoLoaded,
  progress,
}: LoaderProps) {
  return (
    <>
      {/* Fixed loader content that fades out first */}
      <motion.div
        id="loader-infos"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="font-whisper pointer-events-none fixed inset-0 z-[1000000] flex flex-row items-center justify-center font-normal text-white"
      >
        <aside className="flex w-[22vw] flex-col divide-y divide-white border border-solid border-white text-left">
          <div className="px-3 py-2 text-sm">Loading...</div>
          <div className="px-3 py-2 text-sm">Collection: {content.name}</div>
        </aside>
        <div className="relative top-4 ml-5 text-[8vw]">{Math.round(progress)}%</div>
      </motion.div>

      {/* Animated background container that starts after content fades */}
      <motion.div
        initial={{ height: "100vh" }}
        exit={{ height: "0vh" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.5, // Wait 500ms for content to fade out first
        }}
        className="fixed inset-0 w-screen overflow-hidden"
        style={{
          zIndex: 999999,
          background: "black",
        }}
      />
    </>
  );
}
