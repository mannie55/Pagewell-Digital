import Image from "next/image";
import type { ReactNode } from "react";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import webDevelopmentBg from "@/public/images/services/web-development-bg.png";
import {
  AutomationIllustration,
  SeoIllustration,
  WebDesignIllustration,
  WebDevelopmentIllustration,
} from "./services-illustrations";
import { RevealHeading } from "@/components/ui/reveal-heading";

const platforms = [
  { name: "Webflow", src: "/images/services/platforms/webflow.png" },
  { name: "WordPress", src: "/images/services/platforms/wordpress.png" },
  { name: "Astro", src: "/images/services/platforms/astro.png" },
  { name: "Next.js", src: "/images/services/platforms/nextjs.png" },
];

function ServiceCard({
  title,
  description,
  capabilities,
  tone = "light",
  className,
  background,
  illustration,
}: {
  title: string;
  description: string;
  capabilities: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  background?: ReactNode;
  illustration: ReactNode;
}) {
  return (
    <article
      className={cn(
        "relative isolate flex flex-col justify-between gap-8 overflow-hidden rounded-lg px-5 pt-6 md:px-8 md:pt-8",
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
            {title}
          </RevealHeading>
          <p
            className={cn(
              "text-small",
              tone === "dark" ? "text-white/60" : "text-neutral-darkest/60",
            )}
          >
            {description}
          </p>
        </div>
      </div>
      {illustration}
    </article>
  );
}

function Capabilities({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Capabilities">
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
      className="container-page render-when-near flex scroll-mt-24 flex-col gap-10 py-16 md:py-20"
    >
      <header className="flex flex-col gap-6">
        <RevealHeading
          id="services-heading"
          className="heading-h2 max-w-4xl font-sans text-balance"
        >
          One team for design, development and{" "}
          <em className="accent-serif">growth.</em>
        </RevealHeading>
        <p className="text-small text-neutral-darkest/60 max-w-3xl">
          We combine strategy, design and AI-assisted development so your
          website looks distinctive, performs well and keeps working for you
          after launch.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        <div className="grid gap-5 lg:grid-cols-[55fr_45fr]">
          <ServiceCard
            title="Web design"
            description="Interfaces shaped around your message, your audience and the action you want visitors to take. Clear structure, refined visuals and journeys built to convert."
            capabilities={
              <Capabilities
                items={["UX strategy", "UI design", "Responsive"]}
              />
            }
            className="from-flamingo-lightest via-flamingo-light to-flamingo bg-linear-[223deg] from-50% via-80% to-96% lg:h-[38.125rem]"
            illustration={<WebDesignIllustration />}
          />
          <ServiceCard
            tone="dark"
            title="Web development"
            description="Fast, responsive builds in Webflow, WordPress and Shopify, with a CMS your team can manage and the performance to stay quick as you grow."
            capabilities={
              <ul className="flex flex-wrap gap-6" aria-label="Platforms">
                {platforms.map((p) => (
                  <li key={p.name}>
                    <span
                      role="img"
                      aria-label={p.name}
                      className="bg-flamingo-lightest block size-9 mask-contain mask-center mask-no-repeat"
                      style={{ maskImage: `url(${p.src})` }}
                    />
                  </li>
                ))}
              </ul>
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
            illustration={<WebDevelopmentIllustration />}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ServiceCard
            title="AI & automation"
            description="AI built into our workflow, and into yours. We connect your tools, automate email and follow-ups, and remove repetitive tasks so your team can focus on growth."
            capabilities={
              <Capabilities items={["AI workflows", "Email flows"]} />
            }
            className="bg-neutral-lightest pb-6 md:pb-8 lg:min-h-[28.125rem]"
            illustration={<AutomationIllustration />}
          />
          <ServiceCard
            title="SEO & visibility"
            description="Technical SEO, search-led content and AI search optimisation in one plan, so the right people can find your business in Google and in AI answers."
            capabilities={
              <Capabilities items={["Technical SEO", "AI search (AEO)"]} />
            }
            className="border-border border bg-white pb-6 md:pb-8 lg:min-h-[28.125rem]"
            illustration={<SeoIllustration />}
          />
        </div>
      </div>
    </section>
  );
}
