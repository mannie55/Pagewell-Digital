"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element is within `margin` of the viewport (and stays true),
 * or, with `once: false`, only while it is. Used to load heavy below-the-fold
 * pieces late and to pause animations nobody can see.
 */
export function useNearViewport<T extends Element>({
  margin = "600px",
  once = true,
  threshold = 0,
}: { margin?: string; once?: boolean; threshold?: number } = {}) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin: margin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, once, threshold]);

  return { ref, near };
}
