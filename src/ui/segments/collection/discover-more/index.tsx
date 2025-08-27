"use client";

import { typeface } from "@/types/typefaces";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";
import CollectionCard from "./card";

export default function DiscoverMoreCollections({
  content,
}: {
  content: typeface[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
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

  return (
    <div className="relative bg-black overflow-hidden">
      {/* Slider Container */}
      <div className="w-screen h-screen flex items-center justify-center">
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
    </div>
  );
}
