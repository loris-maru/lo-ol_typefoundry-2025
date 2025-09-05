import { useEffect, useState } from "react";

export function useScrollProgress(targetRef: React.RefObject<HTMLElement>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate progress based on element position
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (elementHeight + windowHeight)),
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

  return scrollProgress;
}
