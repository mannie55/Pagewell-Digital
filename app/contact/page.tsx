import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactFormLazy } from "@/components/sections/contact-form-lazy";
import { contactDetails } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Pagewell about your business and your website. We reply with honest next steps, and a fixed written quote if we’re a good fit.",
  alternates: { canonical: "/contact" },
};

const nextSteps = [
  "We read your message and look at your current website.",
  "We reply with a few questions or honest first thoughts.",
  "If we’re a good fit, we book a short call and send a fixed written quote.",
];

// The WhatsApp number in lib/site.ts is still a placeholder; hide it until it's real.
const hasWhatsapp = !/^\+?0+$/.test(contactDetails.whatsapp);

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        cta={false}
        title={
          <>
            Let’s talk about your <em className="accent-serif">website</em>
          </>
        }
        intro="Tell us about your business, what your website should be doing and what isn’t working. The people who read your message are the people who do the work."
      />
      <section
        aria-label="Send us a message"
        className="container-page grid gap-3 pb-14 md:pb-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      >
        <div className="border-border rounded-lg border bg-white p-5 md:p-10">
          <ContactFormLazy />
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-neutral-darkest on-dark relative overflow-hidden rounded-lg p-5 text-white md:p-8">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.2)_1.3px,transparent_1.7px)] [mask-image:radial-gradient(90%_80%_at_100%_0%,black,transparent_70%)] bg-size-[14px_14px]"
            />
            <h2 className="heading-h6 relative mb-6 font-sans font-medium">
              What happens next
            </h2>
            <ol className="relative flex flex-col gap-5">
              {nextSteps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden
                    className="bg-flamingo-light text-flamingo-darkest flex size-8 shrink-0 items-center justify-center rounded-sm font-semibold"
                  >
                    {i + 1}
                  </span>
                  <span className="text-regular text-soft">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-small text-soft relative mt-6 border-t border-white/15 pt-4">
              Here for the free audit? Include your website address and we’ll
              send three written findings.
            </p>
          </div>
          <div className="bg-flamingo-lightest rounded-lg p-5 md:p-8">
            <h2 className="heading-h6 mb-4 font-sans font-medium">
              Prefer to talk?
            </h2>
            <ul className="text-regular flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="hover:text-flamingo-dark inline-flex max-w-full min-w-0 items-center gap-3 wrap-anywhere transition-colors"
                >
                  <EnvelopeSimple
                    weight="fill"
                    aria-hidden
                    className="text-flamingo-dark size-5"
                  />
                  {contactDetails.email}
                </a>
              </li>
              {hasWhatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contactDetails.whatsapp.replace(/\D/g, "")}`}
                    className="hover:text-flamingo-dark inline-flex items-center gap-3 transition-colors"
                  >
                    <WhatsappLogo
                      weight="fill"
                      aria-hidden
                      className="text-flamingo-dark size-5"
                    />
                    WhatsApp {contactDetails.whatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
