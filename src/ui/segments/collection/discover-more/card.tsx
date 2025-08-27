"use client";

import { COLLECTION_DETAILS } from "@/app/content/COLLECTION_DETAILS";
import { CursorTextCircle } from "@/ui/molecules/collection/discover-collection-cursor";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CollectionDetailsCard from "./collection-details-card";

interface CollectionCardProps {
  name: string;
  color: string;
  index: number;
  isActive: boolean;
}

export default function CollectionCard({
  name,
  color,
  index,
  isActive,
}: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const animTime = 0.4;
  const collectionNameId = `collection-name-${index}`;

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <motion.div className="relative z-20 w-full h-full flex items-center justify-center">
        <div>
          {/* Text Overlay - Above the video container */}
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={`collection-${index}`}
                className="absolute left-1/2 mb-8 -translate-x-1/2 flex flex-col items-center justify-center text-white z-20"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: isHovered ? -10 : 30 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: animTime }}
              >
                <div className="text-5xl font-medium text-white cursor-pointer">
                  Collection
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
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: 1,
                  y: isHovered ? 0 : 60,
                }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: animTime, delay: 0.1 }}
              >
                <div
                  id={collectionNameId}
                  style={{
                    fontVariationSettings: `'wght' ${isHovered ? 900 : 400}`,
                  }}
                  className="text-[20vw] text-white font-bold font-fuzar leading-none text-center transition-all duration-300 ease-in-out cursor-pointer"
                  onMouseEnter={() => setIsNameHovered(true)}
                  onMouseLeave={() => setIsNameHovered(false)}
                >
                  {name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={`details-${index}`}
                className="relative z-20 w-full flex items-center justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  top: isHovered ? "-36px" : "20px",
                  opacity: isHovered ? 1 : 0,
                }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: animTime, delay: 0.2 }}
              >
                <CollectionDetailsCard
                  cell1={COLLECTION_DETAILS.cell1}
                  cell2={COLLECTION_DETAILS.cell2}
                  cell3={COLLECTION_DETAILS.cell3}
                  cell4={COLLECTION_DETAILS.cell4}
                  cell5={COLLECTION_DETAILS.cell5}
                  cell6={COLLECTION_DETAILS.cell6}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
              width: isHovered ? "80vw" : "23vw",
              height: isHovered ? "70vh" : "80vh",
              borderRadius: isHovered ? "0px" : "40vw",
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: animTime }}
          >
            <div className="relative w-full h-full">
              <motion.div
                className="absolute z-[5] w-full h-full bottom-0"
                style={{
                  background:
                    "linear-gradient(0deg,rgba(0, 0, 0, 1) 1%, rgba(255, 94, 0, 1) 89%)",
                }}
                animate={{
                  height: isHovered ? 0 : "100%",
                }}
                transition={{ duration: animTime }}
              />
              <video
                src="https://player.vimeo.com/progressive_redirect/playback/1108969674/rendition/1440p/file.mp4?loc=external&log_user=0&signature=4ef76770a8a89f999ac37353efa85b095099cb61ba388044c8d910336f67a2c0"
                autoPlay
                muted
                loop
                playsInline
                className="relative z-0 w-full h-full object-cover"
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
