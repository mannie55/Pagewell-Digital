import { Button } from "@/components/ui/button";
import { HandoffNavCta } from "@/components/ui/handoff-nav";
import { contactHref } from "@/lib/site";
import { splitWords } from "@/lib/split-words";
import { HeroVideo } from "./hero-video";

/**
 * Full-viewport hero card: centred headline, and the buttons in a notch cut
 * into the bottom-centre of the card. The notch is the page's own white; its
 * fillets curve the card's bottom edge up into it.
 *
 * Showreel: HeroVideo plays a desktop or mobile cut by screen width. A scrim, darkest behind the headline, keeps the white
 * text readable over the footage's bright highlights.
 */

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="px-5 pt-2 md:px-3.5">
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

        {/* The notch: a white tab with rounded top corners at the bottom-centre;
            a fillet on each side curves the card's bottom edge up into it.
            8px around 44px buttons keeps it 60px deep. */}
        <div className="absolute inset-x-0 bottom-0 mx-auto flex w-fit gap-2 rounded-t-[1.25rem] bg-white p-2 before:absolute before:right-[calc(100%-1px)] before:bottom-0 before:size-5 before:bg-[radial-gradient(circle_at_0_0,transparent_1.25rem,white_calc(1.25rem+0.5px))] after:absolute after:bottom-0 after:left-[calc(100%-1px)] after:size-5 after:bg-[radial-gradient(circle_at_100%_0,transparent_1.25rem,white_calc(1.25rem+0.5px))] md:gap-3 md:px-2.5">
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
      </div>
    </section>
  );
}
