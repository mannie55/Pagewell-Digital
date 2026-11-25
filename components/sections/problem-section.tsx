import { Button } from "@/components/ui/button";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { contactHref } from "@/lib/site";

type Symptom = {
  /** What the owner says about their own website, in their words. */
  quote: string;
  /** What it costs them. Describes something they can check on their own site. */
  cost: string;
  /** The service that fixes it. Becomes a link once that service page exists. */
  fix: string;
};

const symptoms: Symptom[] = [
  {
    quote: "Nobody finds us on Google.",
    cost: "When someone searches for what you sell, the call goes to whoever shows up first. More people now ask AI tools for recommendations too, and those tools suggest the businesses they can find.",
    fix: "Search and AI visibility",
  },
  {
    quote: "We’re not on Google Maps.",
    cost: "Local customers call the businesses Maps shows them first, often without ever opening a website.",
    fix: "Local search",
  },
  {
    quote: "People visit, but nobody gets in touch.",
    cost: "Every visitor who leaves without calling, messaging or booking is a customer you paid to reach and then lost.",
    fix: "Conversion",
  },
  {
    quote: "Our website is slow and hard to change.",
    cost: "Slow pages lose visitors before they load, and a site only a developer can edit never gets better.",
    fix: "A rebuild made to grow",
  },
];

/**
 * "Sound familiar?" section under the hero. Names the owner's own complaints
 * about their website, what each one costs, and what fixes it, then points to
 * the free audit. Loss framing without scare tactics: every line describes
 * something the visitor can already see on their own site.
 */
export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      className="container-page flex flex-col gap-16 py-16 md:gap-24 md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <p className="bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold">
            Sound familiar?
          </p>
          <RevealHeading
            id="problem-heading"
            className="heading-h2 font-sans text-balance"
          >
            <>
              Your website isn’t broken. It’s{" "}
              <em className="accent-serif">invisible</em>.
            </>
          </RevealHeading>
          <p className="text-regular md:text-medium text-neutral-darkest/60 max-w-xl">
            Most business websites launch, look fine, then sit there. People
            search for what you sell and find someone else. The few who visit
            leave without getting in touch. Websites do work for your kind of
            business. Yours just isn’t finished.
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {symptoms.map((s) => (
            <li
              key={s.quote}
              className="border-border flex flex-col gap-4 rounded-sm border p-5 md:p-6"
            >
              <RevealHeading
                as="h3"
                stagger={0.1}
                className="text-large font-medium text-balance"
              >
                {`“${s.quote}”`}
              </RevealHeading>
              <p className="text-small text-neutral-darkest/60">{s.cost}</p>
              <p className="text-small border-border mt-auto border-t pt-4">
                <span className="text-neutral-darkest/50">What fixes it: </span>
                <span className="font-medium">{s.fix}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-border flex flex-col items-start gap-8 border-t pt-10 md:flex-row md:items-end md:justify-between">
        <p className="heading-h4 max-w-3xl font-sans leading-snug font-medium text-balance">
          A website isn’t finished when it launches. It’s finished when it
          brings you customers.
        </p>
        <div className="flex flex-col gap-3">
          <Button href={contactHref}>Get a free website audit</Button>
          {/* PROMISE: keep only if the team can always reply within one working day. */}
          <p className="text-small text-neutral-darkest/60">
            Free. We reply within one working day.
          </p>
        </div>
      </div>
    </section>
  );
}
