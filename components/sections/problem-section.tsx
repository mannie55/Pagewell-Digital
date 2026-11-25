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
import { ScreenColumns } from "./screen-columns";

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

/** One owner complaint in their own words, one line on the cost, and a picture of it. */
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
      delay={delay}
      className={cn(
        "relative flex flex-col gap-5 overflow-hidden rounded-lg p-6 md:p-8",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col gap-2">
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
            "text-regular",
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

/** A search where three other businesses fill page one. Generic on purpose. */
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

/** A small map: three filled pins, and yours, faded. */
function MapPins() {
  const pins = [
    { x: "22%", y: "38%", on: true },
    { x: "58%", y: "24%", on: true },
    { x: "70%", y: "62%", on: true },
    { x: "36%", y: "70%", on: false },
  ];
  return (
    <div
      aria-hidden
      className="relative mt-auto h-28 overflow-hidden rounded-md bg-white bg-[linear-gradient(rgb(2_2_2/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(2_2_2/0.05)_1px,transparent_1px)] bg-size-[22px_22px]"
    >
      {pins.map((p) => (
        <MapPin
          key={p.x}
          weight="fill"
          className={cn(
            "absolute size-7 -translate-x-1/2 -translate-y-full",
            p.on ? "text-flamingo-dark" : "text-neutral-darkest/20",
          )}
          style={{ left: p.x, top: p.y }}
        />
      ))}
    </div>
  );
}

/** Lots of visits, almost no enquiries. */
function VisitsVsEnquiries() {
  return (
    <div aria-hidden className="text-small mt-auto flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-white/70">Visits</span>
        <span className="bg-flamingo-light h-2.5 w-full rounded-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-white/70">Enquiries</span>
        <span className="h-2.5 w-[6%] rounded-full bg-white/80" />
      </div>
    </div>
  );
}

/** A page that hasn't finished loading. */
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
 * Bento under the hero. A dark card where real landing pages drift past behind
 * the headline, four filled tiles that each picture one complaint, and an
 * orange closing tile with the one CTA.
 */
export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="container-page py-16 md:py-28"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
        <RevealOnScroll className="bg-neutral-darkest relative flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-lg p-6 text-white md:col-span-2 md:min-h-[38rem] md:p-10 lg:col-span-5 lg:row-span-2">
          <ScreenColumns />
          {/* Dot field over the dark fade, rising from the bottom-right corner. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.22)_1.4px,transparent_1.8px)] [mask-image:radial-gradient(90%_55%_at_100%_100%,black,transparent_75%)] bg-size-[14px_14px]"
          />
          <div className="relative flex flex-col gap-4">
            <RevealHeading
              id="problem-heading"
              className="heading-h2 font-sans text-balance"
            >
              <>
                Your website isn’t broken. It’s{" "}
                <em className="accent-serif text-flamingo-light">invisible</em>.
              </>
            </RevealHeading>
            <p className="text-regular md:text-medium max-w-sm text-white/70">
              People search for what you sell and find someone else.
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
          cost="The call goes to whoever shows up first."
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
          cost="Locals call whoever Maps shows first."
        >
          <MapPins />
        </Symptom>

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
          cost="Everyone who leaves is a customer you paid for."
        >
          <VisitsVsEnquiries />
        </Symptom>

        <Symptom
          delay={0.1}
          className="bg-neutral-darkest/5 md:col-span-2 lg:col-span-5"
          icon={
            <IconTile className="bg-flamingo-lighter text-flamingo-darkest">
              <HourglassMedium weight="fill" />
            </IconTile>
          }
          quote="Our website is slow and hard to change."
          cost="Visitors leave before it loads."
        >
          <LoadingBar />
        </Symptom>

        <RevealOnScroll
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
              Free. Three written findings in two working days.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
