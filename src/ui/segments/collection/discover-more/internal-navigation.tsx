import { typeface } from "@/types/typefaces";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { KeenSliderInstance } from "keen-slider/react";

export default function InternalNavigation({
  isNavigating,
  goToPrevNav,
  goToNextNav,
  navStartIndex,
  content,
  currentSlide,
  setCurrentSlide,
  instanceRef,
}: {
  isNavigating: boolean;
  goToPrevNav: () => void;
  goToNextNav: () => void;
  navStartIndex: number;
  content: typeface[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  instanceRef: React.RefObject<KeenSliderInstance>;
}) {
  return (
    <div>
      <motion.div
        className="absolute bottom-[30px] left-0 right-0 px-12 z-[100]"
        animate={{
          y: isNavigating ? 100 : 0,
          opacity: isNavigating ? 0 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-center gap-8">
          {/* Left Chevron */}
          <button
            onClick={goToPrevNav}
            disabled={navStartIndex === 0}
            className="text-white hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous navigation page"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {/* Collection Names Container with smooth sliding - limited to 5 visible */}
          <div className="overflow-hidden w-[600px]">
            {" "}
            {/* Fixed width to show only 5 items */}
            <motion.div
              className="flex items-center gap-8"
              animate={{ x: -navStartIndex * 120 }} // Adjust 120px based on your gap and text width
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {content.map((collection: typeface, index: number) => (
                <button
                  key={collection.slug}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(index);
                    setCurrentSlide(index);
                  }}
                  className={`text-sm text-white transition-all duration-200 hover:opacity-80 relative whitespace-nowrap ${
                    index === currentSlide ? "font-bold" : ""
                  }`}
                >
                  {collection.name}
                  {index === currentSlide && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-[20px]" />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Chevron */}
          <button
            onClick={goToNextNav}
            disabled={navStartIndex + 5 >= content.length}
            className="text-white hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next navigation page"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
