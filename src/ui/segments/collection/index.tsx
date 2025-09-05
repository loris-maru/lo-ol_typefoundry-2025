"use client";

import { useEffect, useState } from "react";

import { useFont } from "@react-hooks-library/core";
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
  const [fakeProgress, setFakeProgress] = useState<number>(0);

  const { error, loaded: fontLoaded } = useFont(fontName, fontUrl);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Combined loading state
  const isFullyLoaded = fontLoaded && videoLoaded;

  // Fake progress animation
  useEffect(() => {
    if (!isFullyLoaded) {
      const startTime = Date.now();
      const duration = 4000;

      const animateProgress = () => {
        // Check if both are loaded - if so, stop animation
        if (fontLoaded && videoLoaded) {
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);

        // Main progress bar
        setFakeProgress(progress);

        if (progress < 100 && !(fontLoaded && videoLoaded)) {
          requestAnimationFrame(animateProgress);
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

  if (error) {
    return (
      <div className="relative flex h-screen w-screen items-center justify-center text-lg text-red-700">
        Error loading font
      </div>
    );
  }

  if (!isFullyLoaded) {
    return (
      <div className="font-whisper relative h-screen w-screen overflow-hidden bg-black p-6 text-white">
        {/* Progress Bar Background */}
        <div className="absolute inset-0 bg-black">
          {/* Main Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-full transition-all duration-100 ease-out"
            style={{
              width: `${fakeProgress}vw`,
              background: "rgba(139, 92, 246, 1)", // Violet
            }}
          />
        </div>

        {/* Loading text with progress indicators */}
        <div className="relative z-10 flex flex-col items-start text-left leading-[1.05] font-normal text-white">
          <div className="flex flex-col divide-y divide-white border border-solid border-white">
            <div className="px-4 py-3">Loading...</div>
            <div className="px-4 py-3">Collection: {content.name}</div>
          </div>
          {/* Progress percentage indicators */}
          <div className="text-[50vw]">{Math.round(fakeProgress)}%</div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* Hero section */}
      <VideoHero content={content} isMobile={isMobile} onVideoLoaded={() => setVideoLoaded(true)} />

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
  );
}
