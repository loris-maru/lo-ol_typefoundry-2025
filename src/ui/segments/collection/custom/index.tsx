import { useRef, useEffect, useState } from "react";

import { useInView, useMotionValue, useTransform, animate } from "motion/react";

import { typeface } from "@/types/typefaces";
import GlobalSettings from "@/ui/segments/collection/custom/global-settings";
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

  // State management for GlobalSettings
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [lineHeight, setLineHeight] = useState(1.35);
  const [wght, setWght] = useState(400);
  const [wdth, setWdth] = useState(100);
  const [slnt, setSlnt] = useState(0);
  const [italic, setItalic] = useState(false);
  const [opsz, setOpsz] = useState(14);

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
      <TypeTesterCustomise
        content={content}
        height={height}
        textColor={textColor}
        textAlign={textAlign}
        backgroundType={backgroundType}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        lineHeight={lineHeight}
        wght={wght}
        wdth={wdth}
        slnt={slnt}
        italic={italic}
        opsz={opsz}
      />
      <GlobalSettings
        content={content}
        text={{
          color: textColor,
          align: textAlign,
          setColor: setTextColor,
          setAlign: setTextAlign,
        }}
        background={{
          type: backgroundType,
          color: backgroundColor || "",
          image: backgroundImage || "",
          setType: setBackgroundType,
          setColor: setBackgroundColor,
          setImage: setBackgroundImage,
        }}
        font={{
          lineHeight: { value: lineHeight, setValue: setLineHeight },
          weight: { value: wght, setValue: setWght },
          width: { value: wdth, setValue: setWdth },
          slant: { value: slnt, setValue: setSlnt },
          italic: { value: italic, setValue: setItalic },
          opticalSize: { value: opsz, setValue: setOpsz },
        }}
      />
    </section>
  );
}
