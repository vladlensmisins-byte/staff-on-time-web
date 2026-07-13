"use client";

import { useEffect, useState } from "react";

const DESKTOP_SRC = "/assets/hero-warehouse.mp4";
const MOBILE_SRC = "/assets/hero-mobile.mp4";

export default function HeroVideo() {
  const [src, setSrc] = useState(DESKTOP_SRC);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setSrc(media.matches ? MOBILE_SRC : DESKTOP_SRC);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <video
      key={src}
      className="hero-video"
      autoPlay
      muted
      loop
      playsInline
      poster="/assets/hero-poster.jpg"
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
