"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling for mouse wheels and trackpads.
 *
 * - Content is untouched: the page is server-rendered HTML and Lenis only
 *   eases the native scroll position, so crawlers, links and find-in-page
 *   behave as before.
 * - Loaded after hydration by dynamic import, so it adds nothing to the
 *   first paint.
 * - Off when the visitor asks for reduced motion; touch keeps native
 *   scrolling (Lenis's default); in-page anchor links glide too.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { destroy(): void } | undefined;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
