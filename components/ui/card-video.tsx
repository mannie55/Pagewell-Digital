"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useStillMedia } from "@/lib/use-media";
import { useNearViewport } from "@/lib/use-near-viewport";

/**
 * Looping background video for the brand-colour CTA cards. Mounted only when
 * the card is near the viewport (these sit below the fold), plays while on
 * screen, pauses off it, and shows its poster under reduced motion or Data
 * Saver. Decorative; the card's own text carries the meaning.
 */
export function CardVideo({
  src = "/videos/cta-liquid.webm",
  poster = "/videos/cta-liquid-poster.jpg",
  className,
}: {
  src?: string;
  poster?: string;
  className?: string;
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>({ margin: "300px" });
  const still = useStillMedia();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || still) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [near, still]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {near &&
        (still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="size-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            className="size-full object-cover"
          >
            <source src={src} type="video/webm" />
          </video>
        ))}
    </div>
  );
}
