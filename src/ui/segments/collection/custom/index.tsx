import { useRef, useEffect } from "react";

import { useInView, useMotionValue, useTransform, animate } from "motion/react";

import { typeface } from "@/types/typefaces";
import TypeTesterCustomise from "@/ui/segments/collection/custom/type-tester-customise";

export default function CustomGeneration({ content }: { content: typeface }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.6, // Trigger when 60% of the container is in view
    once: false, // Allow animation to repeat
  });

  // Create motion value for the animation progress
  const animationProgress = useMotionValue(0);

  // Update animation progress when inView changes with smooth transition
  useEffect(() => {
    animate(animationProgress, isInView ? 1 : 0, {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve for smooth animation
    });
  }, [isInView, animationProgress]);

  // Transform the progress to height values
  const height = useTransform(animationProgress, [0, 1], ["0vh", "60vh"]);

  return (
    <section
      ref={sectionRef}
      className="relative z-40 min-h-screen w-screen bg-[#EFEFEF] p-8"
      style={{ width: "100vw", minHeight: "100vh" }}
    >
      <div className="font-whisper mb-3 flex w-full flex-row justify-between text-base leading-none tracking-wide uppercase">
        <div className="block w-32 whitespace-nowrap">Choose your weight</div>
        <div className="block w-32">Your turn</div>
        <div className="block w-32">Test layouts</div>
      </div>
      <TypeTesterCustomise content={content} height={height} />
    </section>
  );
}
