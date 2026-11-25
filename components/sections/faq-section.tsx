import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { faqs } from "@/data/faqs";
import { contactHref } from "@/lib/site";
import arrowIcon from "@/public/icons/faq/arrow.svg";
import plusIcon from "@/public/icons/faq/plus.svg";

// Structured data so search engines and AI answers can read the questions directly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

/**
 * FAQ accordion built on native <details>: no JavaScript, keyboard accessible,
 * answers always in the HTML, and `name` keeps one answer open at a time.
 */
export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="container-page grid scroll-mt-24 gap-12 py-14 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="flex flex-col items-start gap-8 lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-4">
          <p className="bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold">
            FAQ
          </p>
          <RevealHeading
            id="faq-heading"
            className="heading-h2 font-sans text-balance"
          >
            All your questions, answered{" "}
            <em className="accent-serif">clearly.</em>
          </RevealHeading>
          <p className="text-small text-neutral-darkest/60 max-w-xs">
            Practical answers on pricing, timelines, how we use AI and what
            happens after launch.
          </p>
        </div>
        <Button
          href={contactHref}
          iconRight={<Image src={arrowIcon} alt="" width={11} height={9} />}
        >
          Contact us
        </Button>
      </header>

      <div>
        {faqs.map((faq) => (
          <details
            key={faq.question}
            name="faq"
            className="faq-item group border-border border-b"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
              <h3 className="text-regular md:text-medium">{faq.question}</h3>
              <Image
                src={plusIcon}
                alt=""
                width={22}
                height={22}
                className="shrink-0 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
              />
            </summary>
            <p className="text-small text-neutral-darkest/60 max-w-2xl pr-10 pb-6">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
