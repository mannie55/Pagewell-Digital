"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import buildIcon from "@/public/icons/process/build.svg";
import compassIcon from "@/public/icons/process/compass.png";
import launchIcon from "@/public/icons/process/launch.svg";
import strategyIcon from "@/public/icons/process/strategy.svg";
import { RevealHeading } from "@/components/ui/reveal-heading";

const steps = [
  {
    title: "Audit",
    body: "We look at your website, your search results and your competitors, and show you what’s holding the site back.",
    outputs: ["Three findings", "Search check", "Competitors"],
    icon: compassIcon,
  },
  {
    title: "Plan",
    body: "We agree what success looks like, then put the scope, timeline and a fixed price in writing.",
    outputs: ["Written scope", "Fixed quote", "Timeline"],
    icon: strategyIcon,
  },
  {
    title: "Build and fix",
    body: "We build or repair the site in focused stages, with check-ins so you always know where things stand.",
    outputs: ["Focused stages", "Regular check-ins"],
    icon: buildIcon,
  },
  {
    title: "Launch and grow",
    body: "We test and launch with you and hand it over. On a monthly plan, we keep improving it and report what changed.",
    outputs: ["Launch", "Handover", "Optional monthly plan"],
    icon: launchIcon,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Two-column process layout. The intro column stays pinned on desktop while the
 * steps scroll past; the rail fills and the step crossing the middle of the
 * viewport becomes active. All steps are server-rendered in an ordered list, so
 * the content is complete without JavaScript (step 1 is active by default).
 */
export function ProcessTimeline({ intro }: { intro: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(
        Math.max((line - rect.top) / rect.height, 0),
        1,
      );
      list.style.setProperty("--progress", String(progress));

      let current = 0;
      list.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot, i) => {
        if (dot.getBoundingClientRect().top <= line) current = i;
      });
      // If the page ends before the last step can reach the line, finish it.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atEnd && rect.bottom <= window.innerHeight) {
        current = steps.length - 1;
        list.style.setProperty("--progress", "1");
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:self-start">
        {intro}

        {/* Current-step readout — decorative duplicate of the list, desktop only. */}
        <div
          aria-hidden
          className="border-border hidden items-end gap-5 border-t pt-8 lg:flex"
        >
          <span className="heading-h1 text-flamingo font-serif tabular-nums">
            {pad(active + 1)}
          </span>
          <span className="flex flex-col pb-2">
            <span className="text-small text-muted">
              of {pad(steps.length)}
            </span>
            <span className="text-large">{steps[active].title}</span>
          </span>
        </div>
      </div>

      <ol ref={listRef} className="relative flex flex-col gap-4">
        {/* Rail: pale track with a Flamingo fill that follows scroll progress. */}
        <span
          aria-hidden
          className="bg-flamingo-lighter absolute top-0 bottom-0 left-2 w-0.5 -translate-x-1/2 overflow-hidden rounded-full md:left-8"
        >
          <span
            className="bg-flamingo absolute inset-x-0 top-0"
            style={{ height: "calc(var(--progress, 0) * 100%)" }}
          />
        </span>

        {steps.map((step, i) => {
          const isActive = i === active;
          const reached = i <= active;
          return (
            <li key={step.title} className="relative pl-8 md:pl-20">
              <span
                data-dot
                aria-hidden
                className={cn(
                  "absolute top-10 left-2 size-3.5 -translate-x-1/2 rounded-full ring-4 ring-white transition-colors duration-300 md:left-8",
                  reached ? "bg-flamingo" : "bg-flamingo-lighter",
                )}
              />
              <article
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "relative flex flex-col gap-6 overflow-hidden rounded-lg p-4 transition-shadow duration-500 motion-reduce:transition-none md:gap-8 md:p-8",
                  "bg-neutral-lightest",
                  isActive && "shadow-[0_24px_48px_-28px_rgb(196_84_33/0.55)]",
                )}
              >
                <div className="flex items-start justify-between">
                  {/* The icon tile takes the brand colour with its card's highlight. */}
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-sm transition-colors duration-300 motion-reduce:transition-none",
                      isActive ? "bg-flamingo-light" : "bg-white",
                    )}
                  >
                    <Image src={step.icon} alt="" className="size-5" />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "heading-h3 font-serif tabular-nums transition-colors duration-300",
                      isActive ? "text-flamingo-dark" : "text-neutral",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <RevealHeading
                    as="h3"
                    effect="none"
                    className="heading-h4 font-sans"
                  >
                    {step.title}
                  </RevealHeading>
                  <p
                    className={cn(
                      "text-small max-w-xl transition-colors duration-500",
                      isActive ? "text-soft" : "text-muted",
                    )}
                  >
                    {step.body}
                  </p>
                </div>

                <ul className="flex flex-wrap gap-2" aria-label="What you get">
                  {step.outputs.map((o) => (
                    <li key={o}>
                      <Tag className="bg-white">{o}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
