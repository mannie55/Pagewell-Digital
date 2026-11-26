import { ArrowRight } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { Tag } from "@/components/ui/tag";
import { getService } from "@/data/services";
import { cn } from "@/lib/cn";
import webDevelopmentBg from "@/public/images/services/web-development-bg.png";
import {
  AiSearchIllustration,
  AutomationIllustration,
  SeoIllustration,
  WebDesignIllustration,
} from "./services-illustrations";

/** A service page by slug; a missing one fails the build instead of a 404 link. */
function service(slug: string) {
  const found = getService(slug);
  if (!found) throw new Error(`No service page for "${slug}"`);
  return found;
}

/**
 * One home card per service page. Name and one-liner come from
 * data/services.ts, so a card can't promise something its page doesn't; the
 * whole card links to the page.
 */
function ServiceCard({
  slug,
  capabilities,
  tone = "light",
  className,
  background,
  illustration,
}: {
  slug: string;
  capabilities: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  background?: ReactNode;
  illustration: ReactNode;
}) {
  const { name, short } = service(slug);
  return (
    <article
      className={cn(
        "group relative isolate flex flex-col justify-between gap-8 overflow-hidden rounded-lg px-4 pt-6 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 md:px-8 md:pt-8",
        tone === "dark" && "on-dark text-white",
        className,
      )}
    >
      {background}
      <div className="flex flex-col gap-6 md:gap-8">
        {capabilities}
        <div className="flex max-w-xl flex-col gap-3">
          <RevealHeading
            as="h3"
            effect="none"
            className={cn(
              "heading-h5 font-sans",
              tone === "dark" ? "text-white" : "text-neutral-darkest",
            )}
          >
            {/* The link covers the whole card. */}
            <Link
              href={`/services/${slug}`}
              className="inline-flex items-center gap-3 outline-none after:absolute after:inset-0 after:content-['']"
            >
              {name}
              <ArrowRight
                aria-hidden
                className="size-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </RevealHeading>
          <p className="text-small text-muted">{short}</p>
        </div>
      </div>
      {illustration}
    </article>
  );
}

function Capabilities({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Includes">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="container-page render-when-near flex scroll-mt-24 flex-col gap-10 py-14 md:py-20"
    >
      <header className="flex flex-col items-start gap-6">
        <RevealHeading
          id="services-heading"
          className="heading-h2 max-w-4xl font-sans text-balance"
        >
          We build it, get it found and keep it{" "}
          <em className="accent-serif">working.</em>
        </RevealHeading>
        <p className="text-small text-muted max-w-3xl">
          Most websites are finished on launch day and never touched again. We
          build yours for search from the first page, and on a monthly plan we
          track what it brings in and keep improving it.
        </p>
        <Link
          href="/services"
          className="text-small inline-flex items-center gap-2 font-medium underline underline-offset-4 hover:no-underline"
        >
          All seven services
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </header>

      <div className="flex flex-col gap-5">
        <div className="grid gap-5 lg:grid-cols-[55fr_45fr]">
          <ServiceCard
            slug="website-design"
            capabilities={
              <Capabilities
                items={["UX strategy", "UI design", "Responsive"]}
              />
            }
            className="from-flamingo-lightest via-flamingo-light to-flamingo bg-linear-[223deg] from-50% via-80% to-96% lg:h-[38.125rem]"
            illustration={<WebDesignIllustration />}
          />
          <ServiceCard
            slug="ai-search"
            tone="dark"
            capabilities={
              <Capabilities
                items={["ChatGPT", "Google AI Overviews", "Perplexity"]}
              />
            }
            className="bg-neutral-darkest lg:h-[38.125rem]"
            background={
              <Image
                src={webDevelopmentBg}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="-z-10 object-cover"
              />
            }
            illustration={<AiSearchIllustration />}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ServiceCard
            slug="conversion"
            capabilities={
              <Capabilities
                items={["Clear next steps", "Automatic follow-ups"]}
              />
            }
            className="bg-neutral-lightest pb-6 md:pb-8 lg:min-h-[28.125rem]"
            illustration={<AutomationIllustration />}
          />
          <ServiceCard
            slug="seo"
            capabilities={
              <Capabilities items={["Technical SEO", "Search content"]} />
            }
            className="border-border border bg-white pb-6 md:pb-8 lg:min-h-[28.125rem]"
            illustration={<SeoIllustration />}
          />
        </div>
      </div>
    </section>
  );
}
