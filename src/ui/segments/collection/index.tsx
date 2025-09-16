"use client";

import { useEffect, useState } from "react";

import { useFont } from "@react-hooks-library/core";
import { AnimatePresence } from "motion/react";
import { useMediaQuery } from "usehooks-ts";

import { typeface } from "@/types/typefaces";
import CollectionsSlider from "@/ui/segments/collection/collections-slider";
import CustomGeneration from "@/ui/segments/collection/custom";
import VideoHero from "@/ui/segments/collection/hero";
import CollectionHorizontal from "@/ui/segments/collection/horizontal-scroll-block";
import Playground from "@/ui/segments/collection/playground";
// adjust path if Playground is separate
// import ShopPackages from "@/ui/segments/collection/shop-package";
import Footer from "@/ui/segments/global/footer";
import slugify from "@/utils/slugify";

import Loader from "./loader";
import Story from "./story";

export default function CollectionPage({ content }: { content: typeface }) {
  // FONTS
  const fontName = slugify(content.name);
  const uprightFontUrl = content.varFont;
  const italicFontUrl = content.varFontItalic;

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const { error, loaded: fontLoaded } = useFont(fontName, uprightFontUrl);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Combined loading state - now properly tracks both video and font loading
  const isFullyLoaded = fontLoaded && videoLoaded;

  // Progress animation - single continuous increment from 0 to 100
  useEffect(() => {
    if (!isFullyLoaded) {
      const startTime = Date.now();
      const duration = 3000; // 3 seconds total

      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const timeProgress = Math.min((elapsed / duration) * 100, 100); // 0 to 100% over 3 seconds

        setProgress(timeProgress);

        // Continue animation if not fully loaded
        if (timeProgress < 100 && !isFullyLoaded) {
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
          <Loader
            showLoader={showLoader}
            content={content}
            fontLoaded={fontLoaded}
            videoLoaded={videoLoaded}
            progress={progress}
          />
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

          <Story uprightFontUrl={uprightFontUrl} italicFontUrl={italicFontUrl} content={content} />

          {/* Horizontal scrolling section (Weights, Character Set, Font Info) */}
          <CollectionHorizontal content={content} />

          <CustomGeneration content={content} />

          {/* Spacer to maintain scroll position when ShopPackage becomes fixed */}
          {/* <div className="h-screen w-full bg-transparent" /> */}

          {/* Collections Slider section */}
          <CollectionsSlider />

          {/* Footer - positioned after all content with high z-index */}
          <div className="relative z-50 bg-black">
            <Footer />
          </div>
        </main>
      )}
    </>
  );
}
