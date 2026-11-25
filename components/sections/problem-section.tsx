import {
  CursorClick,
  HourglassMedium,
  MagnifyingGlass,
  MapPin,
} from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { cn } from "@/lib/cn";
import { contactHref } from "@/lib/site";

/** Filled icon tile; the fill, not an outline, carries the shape. */
function IconTile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-sm [&>svg]:size-6",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** One owner complaint in their own words, and what it costs them. */
function Symptom({
  icon,
  quote,
  cost,
  tone = "light",
  className,
  delay,
  children,
}: {
  icon: ReactNode;
  quote: string;
  cost: string;
  tone?: "light" | "dark";
  className?: string;
  delay: number;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <RevealOnScroll
      as="div"
      delay={delay}
      className={cn(
        "relative flex flex-col gap-5 overflow-hidden rounded-lg p-6 md:p-8",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col gap-3">
        <RevealHeading
          as="h3"
          stagger={0.1}
          delay={delay + 0.2}
          className={cn(
            "heading-h6 font-sans font-medium text-balance",
            dark && "text-white",
          )}
        >
          {`“${quote}”`}
        </RevealHeading>
        <p
          className={cn(
            "text-regular max-w-md",
            dark ? "text-white/75" : "text-neutral-darkest/65",
          )}
        >
          {cost}
        </p>
      </div>
      {children}
    </RevealOnScroll>
  );
}

/** Illustration: a search where three other businesses fill page one. Generic on purpose. */
function SearchResults() {
  return (
    <div aria-hidden className="mt-auto flex flex-col gap-2 pt-2">
      <div className="text-small text-neutral-darkest/70 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-[0_6px_20px_-8px_rgb(196_84_33/0.35)]">
        <MagnifyingGlass weight="bold" className="size-4" />
        caterer near me
      </div>
      {["bg-flamingo", "bg-neutral-darkest", "bg-flamingo-light"].map(
        (dot, i) => (
          <div
            key={dot}
            className="flex items-center gap-3 rounded-md bg-white/70 px-4 py-2.5"
          >
            <span className={cn("size-3 rounded-full", dot)} />
            <span
              className="bg-neutral-darkest/15 h-2 rounded-full"
              style={{ width: `${62 - i * 12}%` }}
            />
          </div>
        ),
      )}
      <div className="text-small border-neutral-darkest/20 text-neutral-darkest/55 flex items-center justify-between rounded-md border border-dashed px-4 py-2.5">
        <span>Your business</span>
        <span>Not on page one</span>
      </div>
    </div>
  );
}

/** Illustration: a page that hasn't finished loading. */
function LoadingBar() {
  return (
    <div aria-hidden className="mt-auto flex flex-col gap-2 pt-2">
      <div className="bg-neutral-darkest/10 h-2 overflow-hidden rounded-full">
        <div className="bg-neutral-darkest/60 h-full w-1/3 rounded-full" />
      </div>
      <p className="text-small text-neutral-darkest/55">Still loading…</p>
    </div>
  );
}

/**
 * "Sound familiar?" bento under the hero. A dark intro tile, four filled tiles
 * with the owner's complaints in their own words, and a closing tile with the
 * one CTA. Dots echo the halftone seam into the Work band.
 */
export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="container-page py-16 md:py-28"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        <RevealOnScroll
          as="div"
          className="bg-neutral-darkest relative flex flex-col justify-between gap-10 overflow-hidden rounded-lg p-6 text-white md:col-span-2 md:p-10 lg:col-span-5 lg:row-span-2"
        >
          {/* Dot field, fading in from the bottom-right corner. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.22)_1.4px,transparent_1.8px)] [mask-image:radial-gradient(130%_110%_at_100%_0%,black,transparent_75%)] bg-size-[14px_14px]"
          />
          <p className="text-small relative w-fit rounded-sm bg-white/10 px-2 py-0.5 font-semibold text-white/70">
            Sound familiar?
          </p>
          <div className="relative flex flex-col gap-6">
            <RevealHeading
              id="problem-heading"
              className="heading-h2 font-sans text-balance"
            >
              <>
                Your website isn’t broken. It’s{" "}
                <em className="accent-serif text-flamingo-light">invisible</em>.
              </>
            </RevealHeading>
            <p className="text-regular md:text-medium max-w-md text-white/70">
              Most business websites launch, look fine, then sit there. People
              search for what you sell and find someone else. Yours just isn’t
              finished.
            </p>
          </div>
        </RevealOnScroll>

        <Symptom
          delay={0.1}
          className="bg-flamingo-lightest md:col-span-2 lg:col-span-7"
          icon={
            <IconTile className="bg-flamingo-dark text-white">
              <MagnifyingGlass weight="fill" />
            </IconTile>
          }
          quote="Nobody finds us on Google."
          cost="When someone searches for what you sell, the call goes to whoever shows up first, on Google and in AI answers."
        >
          <SearchResults />
        </Symptom>

        <Symptom
          delay={0.2}
          className="bg-neutral-darkest/5 lg:col-span-3"
          icon={
            <IconTile className="bg-neutral-darkest text-white">
              <MapPin weight="fill" />
            </IconTile>
          }
          quote="We’re not on Google Maps."
          cost="Local customers call the businesses Maps shows them first, often without opening a website."
        />

        <Symptom
          delay={0.3}
          tone="dark"
          className="bg-flamingo-darkest lg:col-span-4"
          icon={
            <IconTile className="bg-flamingo-light text-flamingo-darkest">
              <CursorClick weight="fill" />
            </IconTile>
          }
          quote="People visit, but nobody gets in touch."
          cost="Every visitor who leaves without calling, messaging or booking is a customer you paid to reach and then lost."
        />

        <Symptom
          delay={0.1}
          className="bg-neutral-darkest/5 md:col-span-2 lg:col-span-5"
          icon={
            <IconTile className="bg-flamingo-lighter text-flamingo-darkest">
              <HourglassMedium weight="fill" />
            </IconTile>
          }
          quote="Our website is slow and hard to change."
          cost="Slow pages lose visitors before they load, and a site only a developer can edit never gets better."
        >
          <LoadingBar />
        </Symptom>

        <RevealOnScroll
          as="div"
          delay={0.2}
          className="bg-flamingo-dark relative flex flex-col justify-between gap-8 overflow-hidden rounded-lg p-6 pb-16 text-white md:col-span-2 md:p-10 md:pb-20 lg:col-span-7"
        >
          {/* The halftone seam, reused as a texture along the bottom edge. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-14 bg-[url(/images/seam-dots.svg)] bg-size-[auto_100%] bg-repeat-x opacity-15"
          />
          <p className="heading-h4 relative max-w-xl font-sans leading-snug font-medium text-balance">
            A website isn’t finished when it launches. It’s finished when it
            brings you customers.
          </p>
          <div className="relative flex flex-col items-start gap-3">
            <Button href={contactHref} tone="dark">
              Get a free audit
            </Button>
            {/* PROMISE: the audit is capped at three written findings (docs/templates/free-audit.md).
                Keep the turnaround only if the team can always meet it. */}
            <p className="text-small text-white">
              Free: three written findings within two working days.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
