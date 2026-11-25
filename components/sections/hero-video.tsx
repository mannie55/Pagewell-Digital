"use client";

import { useEffect, useRef, useState } from "react";

/** Width from which the desktop showreel plays. Phones get the mobile cut when it exists. */
const DESKTOP = "(min-width: 768px)";

/**
 * The hero showreel, desktop only for now. Rendered after hydration on wide
 * screens, so phones download nothing. Plays while the hero is on screen,
 * pauses when it scrolls away, and stays on its poster under reduced motion.
 * Decorative: the headline carries the meaning.
 */
export function HeroVideo() {
  const [desktop, setDesktop] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [desktop]);

  if (!desktop) return null;

  return (
    <video
      ref={ref}
      aria-hidden
      muted
      loop
      playsInline
      preload="metadata"
      poster="/videos/hero-desktop-poster.jpg"
      className="absolute inset-0 -z-20 size-full object-cover"
    >
      <source src="/videos/hero-desktop.webm" type="video/webm" />
    </video>
  );
}
