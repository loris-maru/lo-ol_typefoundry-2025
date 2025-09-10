"use client";

import { useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "motion/react";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";

import { typeface } from "@/types/typefaces";
import CollectionCard from "@/ui/segments/collection/discover-more/card";
import InternalNavigation from "@/ui/segments/collection/discover-more/internal-navigation";

import "keen-slider/keen-slider.min.css";

export default function DiscoverMoreCollections({ content }: { content: typeface[] }) {
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
    [0.4, 1], // From 0.76 to 1
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1], // From entering screen to fully scrolled
    ["80px", "0px"], // From 40px to 0px when fully scrolled
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
    if (Array.isArray(content) && navStartIndex + 5 < content.length) {
      setNavStartIndex(navStartIndex + 1);
    }
  };

  const handleNavigate = () => {
    setIsNavigating(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative z-30 overflow-hidden bg-transparent"
      style={{ height: "100vh" }}
    >
      {/* Sticky Container with animated scale and border radius */}
      <motion.div
        className="sticky top-0 left-0 flex h-screen items-center justify-center"
        style={{
          scale,
          borderRadius,
          transformOrigin: "center center",
        }}
      >
        {/* Black Container */}
        <motion.div className="h-full w-full overflow-hidden bg-black" style={{ borderRadius }}>
          {/* Slider Container */}
          <div className="flex h-full w-full items-center justify-center">
            <div ref={sliderRef} className="keen-slider h-full w-full">
              {Array.isArray(content) &&
                content
                  .filter((collection: typeface) => collection && collection.slug) // Filter out invalid collections
                  .map((collection: typeface, index: number) => (
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
            className="absolute top-1/2 left-8 z-[100] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-110 hover:bg-white hover:text-black"
            aria-label="Previous collection"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <button
            type="button"
            name="discover-more-next"
            onClick={goToNext}
            className="absolute top-1/2 right-8 z-[100] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:scale-110 hover:bg-white hover:text-black"
            aria-label="Next collection"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          <InternalNavigation
            isNavigating={isNavigating}
            goToPrevNav={goToPrevNav}
            goToNextNav={goToNextNav}
            navStartIndex={navStartIndex}
            content={content}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            instanceRef={instanceRef as React.RefObject<KeenSliderInstance>}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
