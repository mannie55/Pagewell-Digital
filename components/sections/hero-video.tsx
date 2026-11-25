"use client";

import { useEffect, useRef } from "react";
import { useMedia, useStillMedia } from "@/lib/use-media";

/** Width from which the desktop cut plays; below it, the lighter mobile cut. */
const DESKTOP = "(min-width: 768px)";

const CUTS = {
  desktop: {
    src: "/videos/hero-desktop.webm", // 2.8 MB
    poster: "/videos/hero-desktop-poster.jpg",
  },
  mobile: {
    src: "/videos/hero-mobile.webm", // 0.7 MB
    poster: "/videos/hero-mobile-poster.jpg",
  },
} as const;

type Cut = keyof typeof CUTS;

/**
 * The hero showreel. Picks the desktop or mobile cut after hydration, so each
 * screen downloads only its own file. Plays while the hero is on screen,
 * pauses when it scrolls away, and stays on its poster under reduced motion
 * or when the visitor has Data Saver on. Decorative: the headline carries the
 * meaning.
 */
export function HeroVideo() {
  const desktop = useMedia(DESKTOP);
  const still = useStillMedia();
  const ref = useRef<HTMLVideoElement>(null);

  const cut: Cut | null =
    desktop === undefined ? null : desktop ? "desktop" : "mobile";

  useEffect(() => {
    const video = ref.current;
    if (!video || still) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [cut, still]);

  if (!cut) return null;
  const { src, poster } = CUTS[cut];

  if (still) {
    // Poster only: no video download at all.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 size-full object-cover"
      />
    );
  }

  return (
    <video
      key={cut}
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className="absolute inset-0 -z-20 size-full object-cover"
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
