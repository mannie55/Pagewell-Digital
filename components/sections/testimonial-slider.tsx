"use client";

import Image from "next/image";
import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/cn";
import chevron from "@/public/icons/about/chevron.svg";
import quoteIcon from "@/public/icons/about/quote.svg";
import star from "@/public/icons/about/star.svg";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Glass testimonial card with previous/next controls. Every quote is rendered
 * in the HTML (stacked in one grid cell) so all of them are crawlable; only the
 * active one is visible and exposed to assistive tech.
 */
export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const total = items.length;
  const go = (delta: number) => setActive((i) => (i + delta + total) % total);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="border-border relative flex flex-col gap-8 overflow-hidden rounded-lg border bg-white/40 p-4 backdrop-blur-sm md:p-11"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2.5">
          <p className="text-tiny font-semibold" aria-live="polite">
            {String(active + 1).padStart(2, "0")}
            <span className="text-muted">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <span className="bg-border h-px w-14" />
        </div>
        <Image src={quoteIcon} alt="" width={38} height={28} />
      </div>

      <div className="grid">
        {items.map((t, i) => {
          const isActive = i === active;
          return (
            <figure
              key={i}
              aria-hidden={!isActive}
              inert={!isActive}
              className={cn(
                "col-start-1 row-start-1 flex flex-col gap-8 transition-opacity duration-300 motion-reduce:transition-none",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div
                className="flex gap-1"
                role="img"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {Array.from({ length: t.rating }, (_, s) => (
                  <Image key={s} src={star} alt="" width={17} height={17} />
                ))}
              </div>
              <blockquote className="text-medium md:text-large">
                “{t.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3.5 pr-24">
                <span
                  aria-hidden
                  className="bg-neutral-lightest border-border text-neutral-dark flex size-12 shrink-0 items-center justify-center rounded-full border font-medium"
                >
                  {initials(t.name)}
                </span>
                <span className="flex flex-col">
                  <span className="text-small font-semibold">{t.name}</span>
                  <span className="text-small text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="absolute right-6 bottom-6 flex gap-2 md:right-11 md:bottom-11">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="border-border hover:bg-tint flex size-10 items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 pointer-coarse:size-11"
        >
          <Image src={chevron} alt="" width={18} height={18} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="border-border hover:bg-tint flex size-10 items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 pointer-coarse:size-11"
        >
          <Image
            src={chevron}
            alt=""
            width={18}
            height={18}
            className="rotate-180"
          />
        </button>
      </div>
    </div>
  );
}
