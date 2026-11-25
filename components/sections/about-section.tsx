"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { REVEAL, RevealHeading } from "@/components/ui/reveal-heading";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/cn";
import { useNearViewport } from "@/lib/use-near-viewport";
import clarityIcon from "@/public/icons/about/clarity.svg";
import rocketIcon from "@/public/icons/about/rocket.svg";
import teamIcon from "@/public/icons/about/team.svg";
import globe from "@/public/images/about/globe.png";
import { TestimonialSlider } from "./testimonial-slider";

const principles = [
  {
    title: "Clarity first",
    body: "Message, audience and structure are defined before design begins.",
    icon: clarityIcon,
    tile: "bg-white",
    card: "",
  },
  {
    title: "Senior execution",
    body: "A small, experienced team. The people you speak to are the people who build.",
    icon: teamIcon,
    tile: "bg-neutral-darkest",
    card: "bg-neutral-darkest/5",
  },
  {
    title: "AI-powered, human-led",
    body: "We use AI to move faster and catch more, while people make every creative and strategic call.",
    icon: rocketIcon,
    tile: "bg-flamingo-light",
    card: "bg-neutral-darkest/5",
  },
];

/** Seconds: when the first card starts, and the gap between one card and the next. */
const CARDS = { start: 0.5, gap: 0.75, titleAfter: 0.3 };

/**
 * About section.
 *
 * Everywhere: the intro reveals word by word, then the three principle cards
 * arrive one after another, each card first and its title right behind it.
 *
 * On desktop the section also pins for one extra screen of scrolling ("staged"):
 * the intro plays first; scroll on and it blurs back out the way it came, and
 * the testimonial rises into the same spot beside the cards. Scrolling back up
 * reverses it. Staging is switched on after the page loads, so without
 * JavaScript (and on phones) the section is a normal stacked layout.
 */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: stageRef, near: inView } = useNearViewport<HTMLDivElement>({
    margin: "0px",
    threshold: 0.35,
  });
  const { ref: testimonialRef, near: testimonialInView } =
    useNearViewport<HTMLDivElement>({ margin: "0px 0px -15% 0px" });

  const [staged, setStaged] = useState(false);
  const [phase, setPhase] = useState<0 | 1>(0);

  // Pin only on wide, reasonably tall screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem) and (min-height: 44rem)");
    const apply = () => setStaged(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // While pinned, the first part of the scroll shows the intro, the rest the testimonial.
  useEffect(() => {
    if (!staged) return;
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? -rect.top / travel : 0;
      setPhase(progress > 0.35 ? 1 : 0);
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
  }, [staged]);

  const showIntro = inView && (!staged || phase === 0);
  const showTestimonial = staged ? phase === 1 : testimonialInView;

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className={cn("relative isolate scroll-mt-24", staged && "h-[200vh]")}
    >
      <div
        ref={stageRef}
        className={cn(
          "relative overflow-hidden",
          staged ? "sticky top-0 flex h-screen items-center" : "py-14 md:py-28",
        )}
      >
        <Image
          src={globe}
          alt=""
          aria-hidden
          sizes="(min-width: 768px) 980px, 120vw"
          className={cn(
            "pointer-events-none absolute left-1/2 -z-10 w-[120vw] max-w-[61.25rem] -translate-x-1/2 md:-translate-x-[55%]",
            staged ? "top-1/2 -translate-y-1/2" : "top-16 md:top-20",
          )}
        />

        <div
          className={cn(
            "container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,33rem)] lg:gap-x-28",
            staged ? "items-center" : "lg:gap-y-28",
          )}
        >
          <div
            className={cn(
              "flex max-w-2xl flex-col gap-6",
              staged && "col-start-1 row-start-1",
            )}
          >
            <p
              data-reveal
              data-shown={showIntro ? "" : undefined}
              className="soft-reveal soft-reveal-blur bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold"
            >
              About us
            </p>
            <RevealHeading
              id="about-heading"
              effect="words"
              show={showIntro}
              className="heading-h4 font-sans leading-snug font-medium text-balance"
            >
              At Pagewell, we build websites that go beyond looking good
            </RevealHeading>
            <RevealHeading
              as="p"
              effect="words"
              show={showIntro}
              stagger={REVEAL.textStagger}
              delay={0.9}
              className="heading-h4 font-sans leading-snug font-medium"
            >
              Every project is built with purpose, designed to engage, and
              structured to grow with your business. Whether you’re starting
              fresh or refining a brand, we use AI to move faster while people
              make every creative call.
            </RevealHeading>
          </div>

          <ul
            className={cn(
              "flex flex-col gap-2 lg:col-start-2 lg:row-start-1",
              !staged && "lg:row-span-2 lg:self-start",
            )}
          >
            {principles.map((p, i) => {
              const at = CARDS.start + i * CARDS.gap;
              return (
                <li
                  key={p.title}
                  data-reveal
                  data-shown={inView ? "" : undefined}
                  style={{ "--delay": `${at}s` } as CSSProperties}
                  className={cn(
                    "soft-reveal soft-reveal-blur border-border flex flex-col gap-4 rounded-sm border bg-white/40 p-5 backdrop-blur-sm md:p-6",
                    p.card,
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-sm",
                        p.tile,
                      )}
                    >
                      <Image src={p.icon} alt="" className="size-5" />
                    </span>
                    <RevealHeading
                      as="h3"
                      effect="words"
                      show={inView}
                      stagger={0.1}
                      delay={at + CARDS.titleAfter}
                      className="text-large"
                    >
                      {p.title}
                    </RevealHeading>
                  </div>
                  <p className="text-small text-neutral-darkest/60">{p.body}</p>
                </li>
              );
            })}
          </ul>

          <div
            ref={testimonialRef}
            data-reveal
            data-shown={showTestimonial ? "" : undefined}
            inert={staged && phase === 0}
            style={
              {
                "--delay": staged ? "0.45s" : "0s",
                "--d": "1s",
              } as CSSProperties
            }
            className={cn(
              "soft-reveal soft-reveal-blur max-w-3xl",
              staged
                ? "col-start-1 row-start-1"
                : "lg:col-start-1 lg:row-start-2",
            )}
          >
            <TestimonialSlider items={testimonials} />
          </div>
        </div>
      </div>
    </section>
  );
}
