"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { splitForReveal } from "@/lib/split-words";

/** Shared timing for the split-text blur reveal, in seconds. */
export const REVEAL = {
  stagger: 0.14, // gap between words in a heading
  textStagger: 0.05, // gap between words in a longer paragraph
} as const;

/**
 * Split-text blur reveal: words come in one after another, each sharpening from
 * a blur and rising slightly. Meant for headings and the few statements that
 * should draw attention, not for general body copy.
 *
 * By default it plays once, the first time the element scrolls into view. Pass
 * `show` to drive it yourself: `true` plays it in, `false` plays it back out.
 *
 * The motion is plain CSS transitions (`.reveal-word` in globals.css); this
 * component only flips `data-shown`, so it costs almost nothing to run. The full
 * text is in the server HTML; a <noscript> rule in the root layout shows it when
 * JavaScript is off, and reduced-motion users get it instantly.
 */
export function RevealHeading({
  as = "h2",
  effect = "fade",
  stagger = REVEAL.stagger,
  delay = 0,
  show,
  id,
  className,
  children,
}: {
  as?: "h2" | "h3" | "p";
  /**
   * `words`: the word-by-word blur, kept for a few lines visitors must see
   * (the bento headline, the contact heading). `fade` (default): the whole
   * heading fades up once, quietly. `none`: static, for card titles.
   */
  effect?: "words" | "fade" | "none";
  /** Seconds between one word starting and the next (`words` only). */
  stagger?: number;
  /** Seconds to wait before the first word starts. */
  delay?: number;
  /** Drive the reveal yourself instead of on scroll into view. */
  show?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [seen, setSeen] = useState(false);
  const controlled = show !== undefined;

  useEffect(() => {
    const el = ref.current;
    if (controlled || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controlled]);

  // h2, h3 and p take the same props here; treat the tag as one of them for typing.
  const Tag = as as "h2";

  if (effect === "none") {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  if (effect === "fade") {
    return (
      <Tag
        ref={ref}
        id={id}
        data-reveal
        data-shown={(controlled ? show : seen) ? "" : undefined}
        className={cn("reveal-fade", className)}
        style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      >
        {children}
      </Tag>
    );
  }

  // Screen readers get the sentence whole; the word boxes are for the eyes.
  const { label, words } = splitForReveal(children, (word, i) => (
    <span
      key={i}
      data-reveal
      className="reveal-word"
      style={{ "--i": i } as CSSProperties}
    >
      {word}
    </span>
  ));
  const isHeading = as !== "p";

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      aria-label={isHeading ? label : undefined}
      data-shown={(controlled ? show : seen) ? "" : undefined}
      style={
        {
          "--reveal-stagger": `${stagger}s`,
          "--reveal-delay": `${delay}s`,
        } as CSSProperties
      }
    >
      {isHeading ? null : <span className="sr-only">{label}</span>}
      {words}
    </Tag>
  );
}
