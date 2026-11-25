import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/site";
import { ProcessTimeline } from "./process-timeline";
import { RevealHeading } from "@/components/ui/reveal-heading";

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="container-page scroll-mt-24 py-14 md:py-28"
    >
      <ProcessTimeline
        intro={
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="bg-tint text-small text-muted w-fit rounded-sm px-2 py-0.5 font-semibold">
                Process
              </p>
              <RevealHeading
                id="process-heading"
                className="heading-h2 font-sans text-balance"
              >
                A clear process, from first call to{" "}
                <em className="accent-serif">launch</em>
              </RevealHeading>
              <p className="text-small text-muted max-w-md">
                Written scope, regular check-ins and pre-launch testing keep
                every stage predictable.
              </p>
            </div>
            <div>
              <Button href={contactHref} variant="secondary">
                Contact us
              </Button>
            </div>
          </div>
        }
      />
    </section>
  );
}
