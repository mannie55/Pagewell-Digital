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
                A clear process, from first look to{" "}
                <em className="accent-serif">enquiries</em>
              </RevealHeading>
              <p className="text-small text-muted max-w-md">
                A written scope and fixed quote up front, check-ins as we build,
                and a monthly report if you stay with us on a growth plan.
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
