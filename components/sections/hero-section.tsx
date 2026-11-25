import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HandoffNavCta } from "@/components/ui/handoff-nav";
import { contactHref } from "@/lib/site";
import { splitWords } from "@/lib/split-words";
import videoPlaceholder from "@/public/images/hero-video-placeholder.png";
import { HeroHighlights } from "./hero-highlights";

/**
 * Full-viewport hero card: background showreel, headline anchored bottom-left,
 * and a row of auto-advancing service highlights along the bottom.
 */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="px-3 pt-2 md:px-3.5">
      <div className="bg-neutral-darkest relative isolate flex h-[calc(100svh-5.5rem)] min-h-[36rem] flex-col justify-end overflow-hidden rounded-lg text-white md:h-[calc(100svh-5.75rem)] md:min-h-[44rem]">
        {/* Background media — replace with <video autoPlay muted loop playsInline poster=…> when the showreel is ready. */}
        <Image
          src={videoPlaceholder}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        {/* Legibility scrim + Flamingo glow rising from the bottom-left corner. */}
        <div
          aria-hidden
          className="from-neutral-darkest/90 via-neutral-darkest/50 to-neutral-darkest/25 absolute inset-0 -z-10 bg-linear-to-t"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_0%_100%,--alpha(var(--color-flamingo)/45%),transparent)]"
        />

        <div className="flex flex-col gap-10 p-5 md:p-10">
          <div className="flex max-w-3xl flex-col gap-6">
            <p className="tagline text-flamingo-light">
              Design · Search · Conversion
            </p>
            <h1 id="hero-heading" className="heading-h2 font-sans text-balance">
              {splitWords(
                <>
                  The website <em className="accent-serif">growth</em> your
                  business needs
                </>,
                (word, i) => (
                  <span
                    key={i}
                    className="animate-blur-in inline-block"
                    style={{ animationDelay: `${150 + i * 140}ms` }}
                  >
                    {word}
                  </span>
                ),
              )}
            </h1>
            <p className="text-regular md:text-medium max-w-2xl text-white/80">
              Your website is live. Is it bringing you customers? We design,
              rank and improve websites so the right people find you, trust you
              and get in touch.
            </p>
            <div className="flex flex-wrap gap-4">
              <HandoffNavCta
                href={contactHref}
                className="data-[placement=hero]:h-[3.25rem] data-[placement=hero]:px-6 data-[placement=hero]:text-lg data-[placement=nav]:px-4"
              >
                Get a free audit
              </HandoffNavCta>
              <Button href="/#services" variant="secondary" tone="dark">
                Our services
              </Button>
            </div>
          </div>

          <HeroHighlights />
        </div>
      </div>
    </section>
  );
}
