"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useNearViewport } from "@/lib/use-near-viewport";

/**
 * Rises a block into place the first time it scrolls into view, using the
 * shared `.soft-reveal` CSS (blur + lift, ease-out). Children can join the
 * choreography with their own `[data-shown] .x` rules, timed off `--delay`.
 * `data-reveal` lets the <noscript> rule in the root layout show it without JS.
 */
export function RevealOnScroll({
  as = "div",
  delay = 0,
  duration,
  className,
  style,
  children,
}: {
  as?: "div" | "li" | "article";
  /** Seconds before this block starts. */
  delay?: number;
  /** Seconds the entrance takes (default 0.9). */
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>({
    margin: "0px 0px -12% 0px",
  });
  // div, li and article take the same props here; treat the tag as one of them for typing.
  const Tag = as as "div";

  return (
    <Tag
      ref={ref}
      data-reveal
      data-shown={near ? "" : undefined}
      className={cn("soft-reveal", className)}
      style={
        {
          ...style,
          "--delay": `${delay}s`,
          ...(duration ? { "--d": `${duration}s` } : {}),
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
