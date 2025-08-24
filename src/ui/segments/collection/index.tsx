"use client";

import VideoHero from "./hero";
import Playground from "./playground";
// adjust path if Playground is separate
import ShopPackages from "./shop-package";
import CollectionHorizontal from "./weight-grid/h-scroll";

export default function CollectionPage() {
  const VIDEO_SRC =
    "https://player.vimeo.com/progressive_redirect/playback/1108969674/rendition/2160p/file.mp4?loc=external&log_user=0&signature=ab3dc4fcc24b24ad7982187719e33afc745f2a951f78423e4ef4c5746a0b0b7f";

  return (
    <main className="w-full">
      {/* Hero section */}
      <VideoHero videoSrc={VIDEO_SRC} />

      {/* Playground section */}
      <Playground />

      {/* Horizontal scrolling section (Weights, Character Set, Font Info) */}
      <CollectionHorizontal />

      {/* Shop Packages section - scrolls vertically after horizontal section */}
      <section className="relative h-[100vh] w-full bg-transparent z-10">
        <ShopPackages />
      </section>

      {/* Footer */}
      <footer className="py-24 text-center text-sm text-neutral-400 bg-white">
        © {new Date().getFullYear()} Your Foundry
      </footer>
    </main>
  );
}
