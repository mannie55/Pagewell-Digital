"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Highlight = { label: string; href: string; icon: ReactNode };

/** Filled icons from Phosphor Icons (phosphoricons.com, MIT licence), inlined so they add no library to the page. */
function FilledIcon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      className="size-7"
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

const highlights: Highlight[] = [
  {
    label: "Strategy",
    href: "/#services",
    icon: (
      <FilledIcon path="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm51.58,57.79-32,64a4.08,4.08,0,0,1-1.79,1.79l-64,32a4,4,0,0,1-5.37-5.37l32-64a4.08,4.08,0,0,1,1.79-1.79l64-32A4,4,0,0,1,179.58,81.79Z" />
    ),
  },
  {
    label: "Design",
    href: "/#services",
    icon: (
      <FilledIcon path="M243.31,81.36,174.63,12.68a16,16,0,0,0-22.63,0L123.56,41.12l-58,21.76A16,16,0,0,0,55.36,75.23L34.59,199.83a4,4,0,0,0,6.77,3.49l57-57a23.85,23.85,0,0,1-2.29-12.08,24,24,0,1,1,13.6,23.4l-57,57a4,4,0,0,0,3.49,6.77l124.61-20.77a16,16,0,0,0,12.35-10.16l21.77-58.07L243.31,104a16,16,0,0,0,0-22.63ZM208,116.68,139.32,48l24-24L232,92.68Z" />
    ),
  },
  {
    label: "Development",
    href: "/#services",
    icon: (
      <FilledIcon path="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM92.8,145.6a8,8,0,1,1-9.6,12.8l-32-24a8,8,0,0,1,0-12.8l32-24a8,8,0,0,1,9.6,12.8L69.33,128Zm58.89-71.4-32,112a8,8,0,1,1-15.38-4.4l32-112a8,8,0,0,1,15.38,4.4Zm53.11,60.2-32,24a8,8,0,0,1-9.6-12.8L186.67,128,163.2,110.4a8,8,0,1,1,9.6-12.8l32,24a8,8,0,0,1,0,12.8Z" />
    ),
  },
  {
    label: "E-commerce",
    href: "/#services",
    icon: (
      <FilledIcon path="M231.69,93.81,217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.81A7.94,7.94,0,0,0,24,96v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96A7.94,7.94,0,0,0,231.69,93.81ZM88,112a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8H88Zm64,0a24,24,0,0,1-48,0v-8h48Zm64,0a24,24,0,0,1-11.07,20.2,8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48Z" />
    ),
  },
];

/**
 * Bottom row of the hero. Highlights advance automatically: each active item's
 * progress bar is a CSS animation, and its end moves to the next item. Hovering
 * pauses it; reduced-motion users get a static row.
 */
export function HeroHighlights() {
  const [active, setActive] = useState(0);
  const next = () => setActive((i) => (i + 1) % highlights.length);

  return (
    <ul className="group/highlights hidden grid-cols-4 gap-4 lg:grid xl:gap-10">
      {highlights.map((item, i) => {
        const isActive = i === active;
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 pr-3 transition-colors xl:gap-5 xl:pr-6",
                isActive ? "bg-white/10 backdrop-blur-md" : "hover:bg-white/5",
              )}
            >
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-sm transition-colors xl:size-16",
                  isActive
                    ? "from-flamingo to-flamingo-darker bg-linear-135 text-white"
                    : "bg-white/10 text-white/70",
                )}
              >
                {item.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-tiny font-mono text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "text-regular xl:text-medium font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-white" : "text-white/70",
                  )}
                >
                  {item.label}
                </span>
                <span className="relative mt-2 block h-px overflow-hidden bg-white/20">
                  {isActive && (
                    <span
                      key={active}
                      onAnimationEnd={next}
                      className="bg-flamingo animate-highlight-progress absolute inset-0 origin-left group-hover/highlights:[animation-play-state:paused] motion-reduce:hidden"
                    />
                  )}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
