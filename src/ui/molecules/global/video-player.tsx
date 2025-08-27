"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function VideoPlayerMux({
  title,
  playbackId,
  preload = "none",
  bgOpacity = 1,
  autoplay = true,
}: {
  title: string;
  playbackId: string;
  preload?: string;
  bgOpacity?: number;
  autoplay?: boolean;
}) {
  return (
    <MuxPlayer
      title={title}
      playbackId={playbackId}
      muted={true}
      playsInline={true}
      autoPlay={autoplay}
      loop={true}
      preload={preload}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "fill",
        opacity: bgOpacity,
        transform: "scale(1.3)",
      }}
      className="w-full h-full"
    />
  );
}
