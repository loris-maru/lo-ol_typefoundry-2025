"use client";

import { COLLECTION_DETAILS } from "@/app/content/COLLECTION_DETAILS";
import { motion } from "framer-motion";
import { useState } from "react";
import CollectionDetailsCard from "./collection-details-card";

interface CollectionCardProps {
  name: string;
  color: string;
  index: number;
}

export default function CollectionCard({
  name,
  color,
  index,
}: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      <motion.div className="relative w-full h-full flex items-center justify-center">
        <div>
          {/* Text Overlay - Above the video container */}
          <motion.div
            className="absolute left-1/2 mb-8 -translate-x-1/2 flex flex-col items-center justify-center text-white z-20"
            animate={{
              y: isHovered ? -10 : 30,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-5xl font-medium text-white cursor-pointer">
              Collection
            </div>
          </motion.div>
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
              y: isHovered ? 0 : 60,
            }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div
              style={{
                fontVariationSettings: `'wght' ${isHovered ? 900 : 400}`,
              }}
              className="text-[20vw] text-white font-bold font-fuzar leading-none text-center transition-all duration-300 ease-in-out"
            >
              {name}
            </div>
          </motion.div>
        </div>

        {/* Info Grid - Below the collection name */}
        <motion.div
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 z-20"
          animate={{
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
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
      </motion.div>
    </div>
  );
}
