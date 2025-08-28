"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function VideoPlayerMux({
  title,
  playbackId,
  preload = "none",
  bgOpacity = 1,
  autoplay = true,
  onLoaded,
}: {
  title: string;
  playbackId: string;
  preload?: string;
  bgOpacity?: number;
  autoplay?: boolean;
  onLoaded?: () => void;
}) {
  const handleVideoReady = () => {
    if (onLoaded) {
      onLoaded();
    }
  };

  return (
    <MuxPlayer
      title={title}
      playbackId={playbackId}
      muted={true}
      playsInline={true}
      autoPlay={autoplay}
      loop={true}
      preload={preload}
      onLoadedData={handleVideoReady}
      onCanPlay={handleVideoReady}
      onCanPlayThrough={handleVideoReady}
      onLoadedMetadata={handleVideoReady}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: bgOpacity,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      className="w-full h-full"
      primaryColor="#000000"
      secondaryColor="#ffffff"
    />
  );
}
