import { Sparkle } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { PlayWhenVisible } from "@/components/ui/play-when-visible";
import { FlowNode } from "./flow-node";
import circleCheck from "@/public/icons/services/circle-check.svg";
import contentIcon from "@/public/icons/services/content.svg";
import liveIndicator from "@/public/icons/services/live-indicator.svg";
import rankingsIcon from "@/public/icons/services/rankings.svg";
import searchIcon from "@/public/icons/services/search.svg";
import seoStrategyIcon from "@/public/icons/services/seo-strategy.svg";
import webDesignMockup from "@/public/images/services/web-design-mockup.png";

/*
 * Decorative illustrations for the service cards. Every wrapper is aria-hidden
 * and data-nosnippet so their placeholder text never reaches screen readers or
 * Google result snippets.
 */

export function WebDesignIllustration() {
  return (
    <div
      aria-hidden
      data-nosnippet
      className="relative h-60 shrink-0 md:h-[20.25rem]"
    >
      <div className="absolute inset-y-0 left-0 w-[89%] overflow-hidden rounded-t-sm">
        <Image
          src={webDesignMockup}
          alt=""
          sizes="(min-width: 1024px) 600px, 90vw"
          className="w-full object-cover object-top"
        />
        <div className="from-flamingo/20 absolute inset-0 bg-linear-[118deg] via-transparent via-40% to-transparent" />
      </div>
      <div className="border-border absolute bottom-6 left-0 flex w-60 flex-col gap-2 rounded-md border bg-white/60 p-4 shadow-md backdrop-blur-md">
        <p className="text-small flex items-center gap-2 font-semibold">
          <Image src={circleCheck} alt="" width={24} height={24} />
          Made for your brand
        </p>
        <p className="text-tiny text-muted">Every breakpoint. Every detail.</p>
      </div>
    </div>
  );
}

/**
 * An AI assistant answering a "near me" question and naming the business,
 * for the AI search card. Generic on purpose, like the bento search results.
 */
export function AiSearchIllustration() {
  return (
    <div
      aria-hidden
      data-nosnippet
      className="relative h-60 shrink-0 overflow-hidden px-0 pt-2 md:px-6"
    >
      <div className="bg-neutral-darker flex flex-col gap-4 rounded-sm border border-white/10 p-5">
        <p className="text-small bg-tint self-end rounded-sm px-3 py-2 text-white">
          Who&rsquo;s the best caterer near me?
        </p>
        <div className="flex flex-col gap-2.5">
          <p className="text-tiny text-muted flex items-center gap-1.5">
            <Sparkle weight="fill" className="text-flamingo-light size-3.5" />
            Answer
          </p>
          <span className="bg-tint-strong block h-2 w-11/12 rounded-full" />
          <span className="bg-tint-strong block h-2 w-3/4 rounded-full" />
          <span className="bg-tint-strong block h-2 w-5/6 rounded-full" />
        </div>
      </div>
      <div className="absolute top-[9.25rem] right-4 flex items-center gap-2.5 rounded-sm border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:right-10">
        <Image src={liveIndicator} alt="" width={7} height={7} />
        <span className="text-small font-semibold whitespace-nowrap text-white">
          Your business, recommended
        </span>
      </div>
    </div>
  );
}

/** A connector that touches both neighbours; the Flamingo fill sweeps across in turn. */
function FlowLine({ sweep }: { sweep: string }) {
  return (
    <span className="bg-neutral-light relative block h-px w-full">
      <span
        className={`bg-flamingo absolute inset-x-0 -top-px h-[3px] origin-left rounded-full ${sweep}`}
      />
    </span>
  );
}

const lit = "rounded-sm";

/**
 * SEO flow: Search → SEO strategy → Rankings, and Content → organic growth.
 * One 8s CSS loop (keyframes in globals.css): the lines fill in order, each
 * card lights as the line reaches it, then the growth curve draws itself.
 * Without motion (or with reduced motion) everything shows in its finished state.
 */
export function SeoIllustration() {
  return (
    <PlayWhenVisible className="shrink-0">
      <div
        aria-hidden
        data-nosnippet
        className="border-border grid shrink-0 grid-cols-[minmax(0,1fr)_0.5rem_minmax(0,1.25fr)_0.5rem_minmax(0,1fr)] items-center gap-y-4 rounded-md border p-3 sm:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1.25fr)_1rem_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1.25fr)_3rem_minmax(0,1fr)] md:p-6"
      >
        <div className={lit}>
          <FlowNode icon={searchIcon} label="Search" />
        </div>
        <FlowLine sweep="motion-safe:animate-[seo-line-1_8s_ease-in-out_infinite]" />
        <div
          className={`${lit} motion-safe:animate-[seo-lit-2_8s_ease-out_infinite]`}
        >
          <FlowNode icon={seoStrategyIcon} label="SEO strategy" framed />
        </div>
        <FlowLine sweep="motion-safe:animate-[seo-line-2_8s_ease-in-out_infinite]" />
        <div
          className={`${lit} motion-safe:animate-[seo-lit-3_8s_ease-out_infinite]`}
        >
          <FlowNode icon={rankingsIcon} label="Rankings" framed />
        </div>

        <div className={lit}>
          <FlowNode icon={contentIcon} label="Content" framed />
        </div>
        <FlowLine sweep="motion-safe:animate-[seo-line-3_8s_ease-in-out_infinite]" />
        <div
          className={`${lit} border-border col-span-3 flex h-[5.25rem] min-w-0 flex-col justify-between border bg-white px-2 py-2 motion-safe:animate-[seo-lit-4_8s_ease-out_infinite] md:px-3.5`}
        >
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-tiny text-muted font-semibold">
              Organic growth
            </span>
            {/* Illustrative figure: counts up in step with the curve (CSS counter). */}
            <span className="seo-growth-value text-small text-flamingo-dark leading-none font-semibold tabular-nums motion-safe:animate-[seo-count_8s_ease-in-out_infinite]" />
          </span>
          <svg
            viewBox="0 0 166.467 41.9444"
            preserveAspectRatio="none"
            fill="none"
            className="h-9 w-full overflow-visible"
          >
            <path
              d="M0.214965 40.9678L22.9308 35.9678L41.2781 37.6345L63.9939 25.9678L84.9623 28.4678L108.552 16.8011L126.025 18.4678L146.994 5.96779L166.215 0.967791"
              pathLength={1}
              strokeDasharray={1}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-flamingo motion-safe:animate-[seo-curve_8s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      </div>
    </PlayWhenVisible>
  );
}

export { AutomationIllustration } from "./automation-illustration";
