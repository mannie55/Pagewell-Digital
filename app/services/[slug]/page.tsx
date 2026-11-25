import { ArrowRight, CheckCircle, Quotes } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { ServiceIcon } from "@/components/ui/service-icon";
import { getService, services } from "@/data/services";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

const symptomFills = [
  "bg-flamingo-lightest",
  "bg-tint",
  "bg-neutral-darkest text-white",
];

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.name,
        description: service.intro,
        provider: { "@type": "Organization", name: site.name, url: site.url },
        areaServed: ["United Kingdom", "Nigeria"],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
        label={service.name}
        title={service.title}
        intro={service.intro}
      />

      <section
        aria-labelledby="symptoms-heading"
        className="container-page pb-14 md:pb-24"
      >
        <h2 id="symptoms-heading" className="heading-h5 mb-6 font-sans">
          Sound familiar?
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {service.symptoms.map((quote, i) => (
            <RevealOnScroll
              key={quote}
              delay={i * 0.1}
              className={cn(
                "relative flex min-h-52 flex-col justify-between gap-10 overflow-hidden rounded-lg p-5 md:p-8",
                symptomFills[i],
              )}
            >
              <Quotes
                weight="fill"
                aria-hidden
                className={cn(
                  "size-9",
                  i === 2 ? "text-flamingo-light" : "text-flamingo-dark",
                )}
              />
              <p className="heading-h6 font-sans font-medium text-balance">
                {quote}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="what-heading"
        className="container-page grid gap-8 pb-14 md:pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <div className="flex items-start gap-4">
          <span className="bg-flamingo-dark flex size-12 shrink-0 items-center justify-center rounded-sm text-white">
            <ServiceIcon name={service.icon} className="size-6" />
          </span>
          <h2 id="what-heading" className="heading-h4 font-sans">
            What we do
          </h2>
        </div>
        <ul className="flex flex-col gap-4">
          {service.whatWeDo.map((item) => (
            <li
              key={item}
              className="text-medium border-border flex gap-3 border-b pb-4 last:border-0"
            >
              <CheckCircle
                weight="fill"
                aria-hidden
                className="text-flamingo-dark mt-1 size-5 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="how-heading"
        className="container-page pb-14 md:pb-24"
      >
        <h2 id="how-heading" className="heading-h4 mb-8 font-sans">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.steps.map((step, i) => (
            <RevealOnScroll
              as="li"
              key={step.title}
              delay={i * 0.1}
              className="bg-tint relative flex flex-col gap-10 overflow-hidden rounded-lg p-5 md:p-6"
            >
              <span
                aria-hidden
                className="heading-h3 text-flamingo-dark font-serif tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-large font-medium">{step.title}</h3>
                <p className="text-small text-muted">{step.time}</p>
              </div>
            </RevealOnScroll>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="faq-heading"
        className="container-page grid gap-8 pb-14 md:pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <h2 id="faq-heading" className="heading-h4 font-sans">
          Questions
        </h2>
        <div className="flex flex-col">
          {service.faqs.map((f) => (
            <details
              key={f.q}
              className="group border-border border-b py-5 first:pt-0"
            >
              <summary className="text-large flex cursor-pointer list-none items-center justify-between gap-6 font-medium">
                {f.q}
                <span
                  aria-hidden
                  className="text-flamingo-dark text-2xl leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-regular text-soft mt-3 max-w-2xl">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav
        aria-labelledby="more-heading"
        className="container-page pb-14 md:pb-24"
      >
        <h2
          id="more-heading"
          className="text-small text-muted mb-4 font-semibold"
        >
          More services
        </h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="tap-target bg-tint hover:bg-tint-strong text-regular inline-flex items-center gap-2 rounded-sm px-4 py-2 transition-colors"
              >
                <ServiceIcon
                  name={s.icon}
                  className="text-flamingo-dark size-4"
                />
                {s.name}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CtaBand />
    </main>
  );
}
