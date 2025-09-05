"use client";

import { useEffect, useState } from "react";

import { useFont } from "@react-hooks-library/core";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";

import { typeface } from "@/types/typefaces";
import DiscoverMoreCollections from "@/ui/segments/collection/discover-more";
import VideoHero from "@/ui/segments/collection/hero";
import CollectionHorizontal from "@/ui/segments/collection/horizontal-scroll-block";
import Playground from "@/ui/segments/collection/playground";
// adjust path if Playground is separate
import ShopPackages from "@/ui/segments/collection/shop-package";
import Footer from "@/ui/segments/global/footer";
import slugify from "@/utils/slugify";

export default function CollectionPage({
  content,
  allTypefaces,
}: {
  content: typeface;
  allTypefaces: typeface[];
}) {
  const fontName = slugify(content.name);
  const fontUrl = content.varFont;
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const { error, loaded: fontLoaded } = useFont(fontName, fontUrl);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Combined loading state - now properly tracks both video and font loading
  const isFullyLoaded = fontLoaded && videoLoaded;

  // Progress animation
  useEffect(() => {
    if (!isFullyLoaded) {
      const startTime = Date.now();
      const duration = 3000; // 3 seconds total

      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const timeProgress = Math.min((elapsed / duration) * 80, 80); // Max 80% from time

        // Calculate actual loading progress
        let actualProgress = 0;
        if (fontLoaded) actualProgress += 40; // Font loading is 40% of progress
        if (videoLoaded) actualProgress += 40; // Video loading is 40% of progress

        // Combine time-based and actual loading progress
        const totalProgress = Math.min(timeProgress + actualProgress, 100);
        setProgress(totalProgress);

        // Continue animation if not fully loaded
        if (totalProgress < 100 && !isFullyLoaded) {
          requestAnimationFrame(animateProgress);
        } else if (isFullyLoaded) {
          // When fully loaded, ensure we show 100%
          setProgress(100);
        }
      };

      requestAnimationFrame(animateProgress);
    }
  }, [isFullyLoaded, fontLoaded, videoLoaded]);

  // Fallback timer to prevent infinite loading
  useEffect(() => {
    if (fontLoaded && !videoLoaded) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 3000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [fontLoaded, videoLoaded]);

  // Trigger loader animation when fully loaded
  useEffect(() => {
    if (isFullyLoaded) {
      // Wait a moment to show the loaded status, then start exit animation
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000); // Wait 1 second after loading completes before starting animation

      return () => clearTimeout(timer);
    }
  }, [isFullyLoaded]);

  if (error) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center text-lg text-red-700">
        Error loading font
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ height: "100vh" }}
            exit={{ height: "0vh" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="font-whisper fixed inset-0 overflow-hidden p-6 text-white"
            style={{
              zIndex: 999999,
              background: "rgba(139, 92, 246, 1)", // Violet background
            }}
          >
            {/* Loading text with status indicators */}
            <div className="relative z-10 flex flex-col items-start text-left leading-[1.05] font-normal text-white">
              <div className="flex flex-col divide-y divide-white border border-solid border-white">
                <div className="px-4 py-3">Loading...</div>
                <div className="px-4 py-3">Collection: {content.name}</div>
                <div className="px-4 py-3">
                  Font: {fontLoaded ? "✓" : "⏳"} | Video: {videoLoaded ? "✓" : "⏳"}
                </div>
              </div>
              {/* Huge percentage progress */}
              <div className="font-whisper text-[38vw] font-medium text-white">
                {Math.round(progress)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showLoader && (
        <main className="w-full">
          {/* Hero section */}
          <VideoHero
            content={content}
            isMobile={isMobile}
            onVideoLoaded={() => setVideoLoaded(true)}
          />

          {/* Playground section */}
          <Playground content={content} />

          {/* Horizontal scrolling section (Weights, Character Set, Font Info) */}
          <CollectionHorizontal content={content} />

          {/* Shop Packages section - becomes fixed when scrolled to */}
          <section className="relative h-screen w-screen bg-transparent">
            <ShopPackages content={content} />
          </section>

          {/* Spacer to maintain scroll position when ShopPackage becomes fixed */}
          <div className="h-screen w-full bg-transparent" />

          {/* Discover More Collections section - scrolls over ShopPackage */}
          <section className="relative z-30 h-screen w-full bg-transparent">
            <DiscoverMoreCollections content={allTypefaces} />
          </section>

          {/* Footer - positioned after all content with high z-index */}
          <div className="relative z-50 bg-black">
            <Footer />
          </div>
        </main>
      )}
    </>
  );
}
