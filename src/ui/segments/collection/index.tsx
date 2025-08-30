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
          {/* Progress Bar */}
          <div
            className="absolute bottom-0 left-0 h-full transition-all duration-100 ease-out"
            style={{
              width: `${fakeProgress}vw`,
              background: "rgba(139, 92, 246, 1)",
            }}
          />
        </div>

        {/* Loading text with progress indicators */}
        <div className="relative z-10 text-left text-[10vw] text-white font-black leading-[1.05]">
          <div>Loading {content.name}</div>
          <div>
            {!fontLoaded &&
              !videoLoaded &&
              "Preparing your typography playground..."}
            {fontLoaded && !videoLoaded && "Loading video content..."}
            {fontLoaded && videoLoaded && "Almost ready..."}
          </div>
        </div>

        {/* Progress percentage indicator */}
        <div className="absolute bottom-6 right-6 text-violet-400 text-2xl font-bold z-10">
          {Math.round(fakeProgress)}%
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
