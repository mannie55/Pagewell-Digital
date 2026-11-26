import { ContactFormLazy } from "./contact-form-lazy";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { Tag } from "@/components/ui/tag";
import { serviceChoices } from "@/data/services";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scheme-2 render-when-near scroll-mt-24 py-14 md:py-28"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <header className="section-header">
          <Tag as="p" muted>
            Contact
          </Tag>
          <RevealHeading
            id="contact-heading"
            effect="words"
            className="heading-h2 font-sans text-balance"
          >
            Tell us about your <em className="accent-serif">project</em>
          </RevealHeading>
          <p className="text-small text-muted max-w-md">
            Fill in the blanks and send. It goes straight to the people who will
            do the work.
          </p>
        </header>
        <div className="border-border rounded-lg border bg-white p-4 md:p-10">
          <ContactFormLazy choices={serviceChoices} />
        </div>
      </div>
    </section>
  );
}
