import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/site";

/** Closing call to action for inner pages: "Contact us" and what happens when you do. */
export function CtaBand({
  title = "Your website could be bringing you customers. Let’s find out why it isn’t.",
}: {
  title?: string;
}) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="container-page pb-16 md:pb-28"
    >
      <div className="bg-flamingo-dark relative overflow-hidden rounded-lg px-6 py-12 text-white md:px-12 md:py-16">
        {/* The halftone seam, as texture along the bottom edge. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-14 bg-[url(/images/seam-dots.svg)] bg-size-[auto_100%] bg-repeat-x opacity-15"
        />
        <div className="relative flex flex-col gap-8 pb-4 md:flex-row md:items-end md:justify-between">
          <h2
            id="cta-heading"
            className="heading-h3 max-w-2xl font-sans leading-snug text-balance"
          >
            {title}
          </h2>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <Button href={contactHref} tone="dark">
              Contact us
            </Button>
            <p className="text-small text-white">
              Tell us what’s not working. We’ll show you what we’d fix first.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
