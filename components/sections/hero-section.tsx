import { Button } from "@/components/ui/button";
import { HandoffNavCta } from "@/components/ui/handoff-nav";
import { contactHref } from "@/lib/site";
import { splitWords } from "@/lib/split-words";
import { HeroVideo } from "./hero-video";

/**
 * Full-viewport hero card: centred headline, and the buttons in a notch cut
 * into the bottom-centre of the card. The notch is the page's own white; an
 * S-curve on each side (NotchFlare) carries the card's edge up into it.
 *
 * Showreel: HeroVideo plays a desktop or mobile cut by screen width. A scrim, darkest behind the headline, keeps the white
 * text readable over the footage's bright highlights.
 */
/** One side of the hero notch: an S-curve with level ends, white below it. */
function NotchFlare({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 60"
      preserveAspectRatio="none"
      className={`h-15 w-10 shrink-0 fill-white md:w-16 ${className ?? ""}`}
    >
      <path d="M0 60C32 60 32 0 64 0V60Z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="px-3 pt-2 md:px-3.5">
      <div className="bg-neutral-darkest relative isolate flex h-[calc(100svh-5.5rem)] min-h-[36rem] flex-col items-center justify-center overflow-hidden rounded-lg text-white md:h-[calc(100svh-5.75rem)] md:min-h-[44rem]">
        <HeroVideo />
        {/* Scrim over the showreel: darkest behind the centred headline. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(65%_60%_at_50%_45%,rgb(2_2_2/0.78),rgb(2_2_2/0.35))]"
        />
        {/* Flamingo glow rising behind the notch, with the site's dot texture over it. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_100%,--alpha(var(--color-flamingo)/40%),transparent)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.16)_1.3px,transparent_1.7px)] [mask-image:radial-gradient(70%_65%_at_50%_100%,black,transparent_75%)] bg-size-[16px_16px]"
        />

        <div className="flex max-w-4xl flex-col items-center gap-6 px-5 pb-20 text-center md:px-10 md:pb-24">
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
          <p className="text-regular md:text-medium max-w-2xl text-balance text-white/80">
            We design, rank and improve websites so the right people find you,
            trust you and get in touch.
          </p>
        </div>

        {/* The notch: a white tab at the bottom-centre. Each side is one smooth
            S-curve (inline SVG) from the card's bottom edge up to the tab's flat
            top, with no straight wall, so the edge flows around the buttons. */}
        <div className="absolute inset-x-0 bottom-0 mx-auto flex w-fit items-end">
          <NotchFlare className="-mr-px" />
          <div className="flex h-15 items-center gap-2 bg-white px-1 md:gap-3">
            <HandoffNavCta
              href={contactHref}
              className="data-[placement=hero]:text-regular data-[placement=hero]:h-11 data-[placement=hero]:px-5 data-[placement=nav]:px-4 md:data-[placement=hero]:px-6 md:data-[placement=hero]:text-lg"
            >
              Contact us
            </HandoffNavCta>
            <Button
              href="/services"
              variant="secondary"
              className="h-11 px-5 py-0 md:px-6"
            >
              Our services
            </Button>
          </div>
          <NotchFlare className="-ml-px -scale-x-100" />
        </div>
      </div>
    </section>
  );
}
