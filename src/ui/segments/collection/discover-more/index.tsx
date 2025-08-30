"use client";

import { typeface } from "@/types/typefaces";
import CollectionCard from "@/ui/segments/collection/discover-more/card";
import InternalNavigation from "@/ui/segments/collection/discover-more/internal-navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import { useRef, useState } from "react";

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
    [0, 0.7], // From entering screen to 70% of scroll progress
    ["40px", "0px"] // From 40px to 0px (reaches 0 earlier)
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

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden z-30"
      style={{ height: "100vh" }}
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
        </div>
      </motion.div>
    </section>
  );
}
