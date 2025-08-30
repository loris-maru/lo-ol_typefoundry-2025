"use client";

import { COLLECTION_DETAILS } from "@/app/content/COLLECTION_DETAILS";
import { typeface } from "@/types/typefaces";
import { CursorTextCircle } from "@/ui/molecules/collection/discover-collection-cursor";
import VideoPlayerMux from "@/ui/molecules/global/video-player";
import CollectionDetailsCard from "@/ui/segments/collection/discover-more/collection-details-card";
import slugify from "@/utils/slugify";
import { useFont } from "@react-hooks-library/core";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
import { useMediaQuery } from "usehooks-ts";

interface CollectionCardProps {
  content: typeface;
  index: number;
  isActive: boolean;
  onNavigate?: () => void;
}

export default function CollectionCard({
  content,
  index,
  isActive,
}: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const router = useRouter();

  const handleNavigate = async () => {
    setIsNavigating(true);

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to collection page
    router.push(`/collection/${content.slug}`);
  };

  const animTime = 0.4;
  const collectionNameId = `collection-name-${index}`;

  const isMobile = useMediaQuery("(max-width: 768px)");

  const familyName = slugify(content.name);
  const fontFile = content.varFont;

  const { loaded, error } = useFont(familyName, fontFile);

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
    <div className="relative w-screen h-screen flex items-center justify-center">
      <motion.div className="relative z-20 w-full h-full flex items-center justify-center">
        <button
          onClick={handleNavigate}
          className="relative z-20 w-full h-full flex items-center justify-center"
        >
          {/* Text Overlay - Above the video container */}
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={`collection-${index}`}
                className="absolute left-1/2 -translate-x-1/2 top-1/4 -translate-y-1/2 flex flex-col items-center justify-center text-white z-20"
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: isNavigating ? 0 : 1,
                  y: isHovered ? 0 : 30,
                }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: animTime }}
              >
                <div className="text-2xl font-normal text-white cursor-pointer font-kronik">
                  Discover the collection
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={`name-${index}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: 1,
                  y: isHovered ? 0 : 30,
                }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: animTime, delay: 0.1 }}
              >
                <div
                  id={collectionNameId}
                  style={{
                    fontFamily: familyName,
                    fontVariationSettings: `'wght' ${
                      isHovered ? 900 : 400
                    }, 'wdth' 900, 'opsz' 900`,
                  }}
                  className="text-[16vw] text-white font-bold font-fuzar leading-none text-center transition-all duration-300 ease-in-out cursor-pointer"
                >
                  {isNavigating ? content.name.substring(0, 2) : content.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={`details-${index}`}
                className="absolute left-1/2 -translate-x-1/2 bottom-1/4 translate-y-1/2 flex items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: isHovered && !isNavigating ? 1 : 0,
                  y: isHovered ? 0 : 20,
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: animTime, delay: 0.2 }}
              >
                <CollectionDetailsCard
                  cell1={content.category}
                  cell2={`${content.axis} axis`}
                  cell3={`${content.totalGlyphs} glyphs`}
                  cell4={COLLECTION_DETAILS.cell4}
                  cell5="Latin"
                  cell6={`${content.hasHangul ? "Hangul" : "No Hangul"}`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Info Grid - Below the collection name */}
      </motion.div>

      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={`container-${index}`}
            className="absolute z-0 cursor-none group overflow-hidden bg-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              width: isNavigating ? "100vw" : isHovered ? "70vh" : "23vw",
              height: isNavigating ? "100vh" : isHovered ? "70vh" : "80vh",
              borderRadius: isNavigating ? 0 : isHovered ? "50vw" : "40vw",
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: animTime }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute z-[5] w-full h-full bottom-0"
                style={{
                  background: `linear-gradient(0deg,rgba(0, 0, 0, 1) 1%, #${content.color} 89%)`,
                }}
                animate={{
                  opacity: isNavigating ? 0 : 1,
                  height: isHovered ? 0 : "100%",
                }}
                transition={{ duration: animTime }}
              />
              <VideoPlayerMux
                className="scale-200"
                title={content?.name}
                autoplay={isHovered}
                playbackId={
                  isMobile
                    ? content.muxMobileVideo.playbackId
                    : content.muxDesktopVideo.playbackId
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CursorTextCircle - Appears when hovering over collection name */}
      {isActive && (
        <CursorTextCircle
          text="DISCOVER THE NEW COLLECTION • "
          targetId={collectionNameId}
          radius={60}
          fontSize={14}
          clockwise={true}
          showWhenNotHovering={false}
        />
      )}
    </div>
  );
}
