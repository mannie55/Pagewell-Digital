"use client";

import type { ReactNode } from "react";
import { useNearViewport } from "@/lib/use-near-viewport";

/**
 * Pauses the CSS animations inside it while it is off screen, so looping
 * illustrations don't keep the browser busy when nobody can see them.
 * (Rule in globals.css: `[data-play-when-visible]:not([data-playing]) *`.)
 */
export function PlayWhenVisible({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>({
    margin: "0px",
    once: false,
  });
  return (
    <div
      ref={ref}
      data-play-when-visible
      data-playing={near ? "" : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
