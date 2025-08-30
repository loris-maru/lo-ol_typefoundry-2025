// components/VimeoWithLoader.tsx
"use client";

import Player from "@vimeo/player";
import { useEffect, useRef, useState } from "react";

export type VimeoPlayer = {
  videoId: string | number; // e.g. 1108969674
  autoPlay?: boolean; // defaults true (muted to satisfy autoplay policies)
  showControls?: boolean; // defaults true
  className?: string; // wrapper extra classes
  // Optional: aspect ratio (w:h). Defaults 16:9
  ratioW?: number;
  ratioH?: number;
};

export default function VimeoWithLoader({
  videoId,
  autoPlay = true,
  showControls = true,
  className = "",
  ratioW = 16,
  ratioH = 9,
}: VimeoPlayer) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build Vimeo embed URL
  const params = new URLSearchParams({
    // These help autoplay reliably (muted) and keep UX nice.
    autoplay: autoPlay ? "1" : "0",
    muted: autoPlay ? "1" : "0",
    title: "0",
    byline: "0",
    portrait: "0",
    autopause: "0", // optional
    controls: showControls ? "1" : "0",
    // keep your other flags if you like (badge, app_id, etc.)
  });

  const src = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;

  useEffect(() => {
    if (!iframeRef.current) return;

    const player = new Player(iframeRef.current);

    // Wait for the player to be ready
    player
      .ready()
      .then(async () => {
        setIsReady(true);

        // If autoplay requested, try to play (might still be blocked if unmuted)
        if (autoPlay) {
          try {
            await player.play();
          } catch (e) {
            // Autoplay may fail if browser policy blocks it
            console.warn("Autoplay prevented:", e);
          }
        }
      })
      .catch((e: Error) => {
        console.error(e);
        setError("Unable to initialize the video player.");
      });

    // Optional: listen to buffering/playing if you want a stricter “ready to show” criterion
    // player.on("playing", () => setIsReady(true));

    return () => {
      player.unload().catch(() => {});
    };
  }, [autoPlay]);

  // Aspect-ratio wrapper using the CSS padding-top trick
  const paddingTop = `${(ratioH / ratioW) * 100}%`;

  return (
    <div className={`relative ${className}`}>
      {/* Loader overlay (shown until player.ready resolves) */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            <p className="text-sm opacity-80">Loading video…</p>
          </div>
        </div>
      )}

      {/* Error overlay (optional) */}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <p className="text-white">{error}</p>
        </div>
      )}

      {/* Responsive box */}
      <div className="w-full" style={{ position: "relative", paddingTop }}>
        <iframe
          ref={iframeRef}
          src={src}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute left-0 top-0 h-full w-full"
        />
      </div>
    </div>
  );
}
