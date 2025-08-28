"use client";

import { typeface } from "@/types/typefaces";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useRef, useState } from "react";
import CollectionCard from "./card";

export default function DiscoverMoreCollections({
  content,
}: {
  content: typeface[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navStartIndex, setNavStartIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll-based scale and border radius animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1], // From entering screen to reaching top
    [0.4, 1] // From 0.76 to 1
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1], // From entering screen to reaching top
    ["40px", "0px"] // From 40px to 0px
  );

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1,
      spacing: 0,
    },
    dragSpeed: 0.2,
    rubberband: false,
  });

  const goToPrev = () => {
    instanceRef.current?.prev();
  };

  const goToNext = () => {
    instanceRef.current?.next();
  };

  const goToPrevNav = () => {
    if (navStartIndex > 0) {
      setNavStartIndex(navStartIndex - 1);
    }
  };

  const goToNextNav = () => {
    if (navStartIndex + 5 < content.length) {
      setNavStartIndex(navStartIndex + 1);
    }
  };

  const handleNavigate = () => {
    setIsNavigating(true);
  };

  // Get the 5 collections to show in navigation
  const visibleCollections = content.slice(navStartIndex, navStartIndex + 5);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden z-30"
      style={{ height: "100vh" }} // Give it more height for scrolling
    >
      {/* Sticky Container with animated scale and border radius */}
      <motion.div
        className="sticky top-0 left-0 h-screen flex items-center justify-center"
        style={{
          scale,
          borderRadius,
          transformOrigin: "center center",
        }}
      >
        {/* Black Container */}
        <div className="w-full h-full bg-black rounded-[40px] overflow-hidden">
          {/* Slider Container */}
          <div className="w-full h-full flex items-center justify-center">
            <div ref={sliderRef} className="keen-slider w-full h-full">
              {content.map((collection: typeface, index: number) => (
                <div
                  key={collection.slug}
                  className="keen-slider__slide flex items-center justify-center"
                >
                  <CollectionCard
                    content={collection}
                    index={index}
                    isActive={index === currentSlide}
                    onNavigate={handleNavigate}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            name="discover-more-prev"
            onClick={goToPrev}
            className="absolute left-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 bg-black hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Previous collection"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            type="button"
            name="discover-more-next"
            onClick={goToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-[100] w-12 h-12 bg-black hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Next collection"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Internal Navigation */}
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
      </motion.div>
    </section>
  );
}
