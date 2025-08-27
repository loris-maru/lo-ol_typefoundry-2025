"use client";

import VideoHero from "./hero";
import Playground from "./playground";
// adjust path if Playground is separate
import { typeface } from "@/types/typefaces";
import slugify from "@/utils/slugify";
import { useFont } from "@react-hooks-library/core";
import { BounceLoader } from "react-spinners";
import { useMediaQuery } from "usehooks-ts";
import DiscoverMoreCollections from "./discover-more";
import ShopPackages from "./shop-package";
import CollectionHorizontal from "./weight-grid/h-scroll";

export default function CollectionPage({
  content,
  allTypefaces,
}: {
  content: typeface;
  allTypefaces: typeface[];
}) {
  const fontName = slugify(content.name);
  const fontUrl = content.varFont;

  const { error, loaded, font } = useFont(fontName, fontUrl);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (error) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center text-red-700 text-lg">
        Error loading font
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-white">
        {/* Large Bounce Loader with different transparency levels */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <BounceLoader
            color="rgba(0, 0, 0, 0.1)"
            size={80}
            speedMultiplier={0.8}
          />
          <BounceLoader
            color="rgba(0, 0, 0, 0.3)"
            size={80}
            speedMultiplier={0.6}
          />
          <BounceLoader
            color="rgba(0, 0, 0, 0.5)"
            size={80}
            speedMultiplier={0.4}
          />
          <BounceLoader
            color="rgba(0, 0, 0, 0.7)"
            size={80}
            speedMultiplier={0.2}
          />
          <BounceLoader
            color="rgba(0, 0, 0, 0.9)"
            size={80}
            speedMultiplier={0.1}
          />
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-2xl font-medium text-black/60 mb-2">
            Loading {content.name}
          </h2>
          <p className="text-sm text-black/40">
            Preparing your typography playground...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* Hero section */}
      <VideoHero content={content} isMobile={isMobile} />

      {/* Playground section */}
      <Playground content={content} />

      {/* Horizontal scrolling section (Weights, Character Set, Font Info) */}
      <CollectionHorizontal content={content} />

      {/* Shop Packages section - scrolls vertically after horizontal section */}
      <section className="relative h-[100vh] w-screen bg-[#efefef] z-10">
        <ShopPackages content={content} />
      </section>

      {/* Discover More Collections section */}
      <section className="relative h-[100vh] w-full bg-transparent z-10">
        <DiscoverMoreCollections content={allTypefaces} />
      </section>

      {/* Footer */}
      <footer className="relative z-[200] py-24 text-center text-sm text-neutral-400 bg-white">
        © {new Date().getFullYear()} Your Foundry
      </footer>
    </main>
  );
}
