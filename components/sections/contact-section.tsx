import { ContactFormLazy } from "./contact-form-lazy";
import { RevealHeading } from "@/components/ui/reveal-heading";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scheme-2 render-when-near scroll-mt-24 py-16 md:py-28"
    >
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <header className="flex flex-col gap-4">
          <p className="bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold">
            Contact
          </p>
          <RevealHeading
            id="contact-heading"
            className="heading-h2 font-sans text-balance"
          >
            Tell us about your <em className="accent-serif">project</em>
          </RevealHeading>
          <p className="text-small text-neutral-darkest/60 max-w-md">
            Fill in the blanks and send. It goes straight to the people who will
            do the work.
          </p>
        </header>
        <div className="border-border rounded-lg border bg-white p-6 md:p-10">
          <ContactFormLazy />
        </div>
      </div>
    </section>
  );
}
