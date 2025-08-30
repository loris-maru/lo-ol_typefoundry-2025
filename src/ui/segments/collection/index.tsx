"use client";

import VideoHero from "@/ui/segments/collection/hero";
import Playground from "@/ui/segments/collection/playground";
// adjust path if Playground is separate
import { typeface } from "@/types/typefaces";
import DiscoverMoreCollections from "@/ui/segments/collection/discover-more";
import CollectionHorizontal from "@/ui/segments/collection/horizontal-scroll-block";
import ShopPackages from "@/ui/segments/collection/shop-package";
import slugify from "@/utils/slugify";
import { useFont } from "@react-hooks-library/core";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export default function CollectionPage({
  content,
  allTypefaces,
}: {
  content: typeface;
  allTypefaces: typeface[];
}) {
  const fontName = slugify(content.name);
  const fontUrl = content.varFont;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [progressBar2, setProgressBar2] = useState(0);
  const [progressBar3, setProgressBar3] = useState(0);
  const [progressBar4, setProgressBar4] = useState(0);

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

        // Staggered progress bars with different delays
        setProgressBar2(Math.min(Math.max(0, progress - 15), 100)); // 15% delay
        setProgressBar3(Math.min(Math.max(0, (progress - 30) * 1.8), 100)); // 30% delay, 1.8x speed
        setProgressBar4(Math.min(Math.max(0, (progress - 45) * 2.2), 100)); // 45% delay, 2.2x speed

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
        console.log("Video loading timeout - proceeding anyway");
        setVideoLoaded(true);
      }, 3000); // 5 second timeout

      return () => clearTimeout(timer);
    }
  }, [fontLoaded, videoLoaded]);

  if (error) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center text-red-700 text-lg">
        Error loading font
      </div>
    );
  }

  if (!isFullyLoaded) {
    return (
      <div className="relative w-screen h-screen p-6 bg-black text-white font-whisper overflow-hidden">
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

          {/* Progress Bar 2 - Delayed by 15% */}
          <div
            className="absolute bottom-0 left-0 h-full transition-all duration-100 ease-out opacity-80"
            style={{
              width: `${progressBar2}vw`,
              background: "rgba(59, 130, 246, 1)", // Blue
            }}
          />

          {/* Progress Bar 3 - Delayed by 30% */}
          <div
            className="absolute bottom-0 left-0 h-full transition-all duration-100 ease-out opacity-60"
            style={{
              width: `${progressBar3}vw`,
              background: "rgba(0, 0, 0, 1)", // Green
            }}
          />

          {/* Progress Bar 4 - Delayed by 45% */}
          <div
            className="absolute bottom-0 left-0 h-full transition-all duration-100 ease-out opacity-40"
            style={{
              width: `${progressBar4}vw`,
              background: "rgba(80, 4, 239, 1)", // Amber
            }}
          />
        </div>

        {/* Loading text with progress indicators */}
        <div className="relative z-10 text-left text-[20vw] text-white font-black leading-[1.05]">
          <div>Loading</div>
          <div>{content.name}</div>
        </div>

        {/* Progress percentage indicators */}
        <div
          id="loader-progress-bar-1"
          className="absolute bottom-6 right-6 text-violet-400 text-2xl font-bold z-10"
        >
          {Math.round(fakeProgress)}%
        </div>

        {/* Additional progress indicators */}
        <div className="absolute bottom-6 right-32 text-blue-400 text-lg font-bold z-10">
          {Math.round(progressBar2)}%
        </div>

        <div className="absolute bottom-6 right-48 text-green-400 text-lg font-bold z-10">
          {Math.round(progressBar3)}%
        </div>

        <div className="absolute bottom-6 right-64 text-amber-400 text-lg font-bold z-10">
          {Math.round(progressBar4)}%
        </div>
      </div>
    );
  }

  return (
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
      <section className="relative h-screen w-full bg-transparent z-30">
        <DiscoverMoreCollections content={allTypefaces} />
      </section>

      {/* Footer */}
      <footer className="relative z-[200] py-24 text-center text-sm text-neutral-400 bg-white">
        © {new Date().getFullYear()} Your Foundry
      </footer>
    </main>
  );
}
