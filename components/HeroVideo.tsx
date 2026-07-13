"use client";

import { useEffect, useState } from "react";

const DESKTOP_SRC = "/assets/hero-warehouse.mp4?v=3";
const MOBILE_SRC = "/assets/hero-mobile.mp4?v=3";
const DESKTOP_POSTER = "/assets/hero-poster.jpg?v=3";
const MOBILE_POSTER = "/assets/hero-poster-mobile.jpg?v=3";

export default function HeroVideo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const src = isMobile ? MOBILE_SRC : DESKTOP_SRC;
  const poster = isMobile ? MOBILE_POSTER : DESKTOP_POSTER;

  // Desktop: show full frame (contain) + blurred cover behind for a premium, edge-to-edge feel.
  // Mobile: keep a single cover video to avoid extra decode cost.
  if (isMobile) {
    return (
      <video
        key={src}
        className="hero-video hero-video-mobile"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <>
      <video
        key={`${src}:bg`}
        className="hero-video hero-video-bg"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
      <video
        key={`${src}:fg`}
        className="hero-video hero-video-fg"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
