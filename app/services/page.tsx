import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { ServiceIcon } from "@/components/ui/service-icon";
import { services } from "@/data/services";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design, SEO, local SEO, AI search optimisation, link building, Google and Meta ads, and conversion: everything a website needs to bring in customers.",
  alternates: { canonical: "/services" },
};

// Bento rhythm: the first card is dark and wide, the rest alternate warm and neutral fills.
const fills = [
  "bg-neutral-darkest text-white lg:col-span-2",
  "bg-flamingo-lightest",
  "bg-tint",
  "bg-tint",
  "bg-flamingo-lightest",
  "bg-flamingo-lightest lg:col-span-2",
  "bg-tint",
];

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        crumbs={[{ label: "Services" }]}
        title={
          <>
            Everything your website needs to{" "}
            <em className="accent-serif">grow</em>
          </>
        }
        intro="Start with what’s holding your website back. Most businesses need two or three of these, not all seven."
      />
      <section
        aria-label="All services"
        className="container-page pb-14 md:pb-28"
      >
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const dark = i === 0;
            return (
              <RevealOnScroll
                as="li"
                key={s.slug}
                delay={(i % 3) * 0.08}
                className={cn("rounded-lg", fills[i], dark && "on-dark")}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full min-h-60 flex-col justify-between gap-10 rounded-lg p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current md:p-8"
                >
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-sm",
                      dark
                        ? "bg-flamingo-light text-flamingo-darkest"
                        : "bg-flamingo-dark text-white",
                    )}
                  >
                    <ServiceIcon name={s.icon} className="size-6" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h2 className="heading-h5 flex items-center gap-3 font-sans">
                      {s.name}
                      <ArrowRight
                        aria-hidden
                        className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
                      />
                    </h2>
                    <p className="text-regular text-soft max-w-md">{s.short}</p>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </ul>
      </section>
      <CtaBand />
    </main>
  );
}
