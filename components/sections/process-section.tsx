import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/site";
import { ProcessTimeline } from "./process-timeline";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { Tag } from "@/components/ui/tag";

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
            <div className="section-header">
              <Tag as="p" muted>
                Process
              </Tag>
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
