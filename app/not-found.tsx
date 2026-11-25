import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { contactHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Every unknown URL, and every notFound() call (an unknown service or case
 * study). Next sends this file with every route, so it stays a Server
 * Component with plain links: it adds no JavaScript to any page. The status is
 * a real 404 with noindex (e2e/routes.spec.ts).
 */
export default function NotFound() {
  return (
    <main>
      <PageHeader
        crumbs={[{ label: "Page not found" }]}
        title="This page isn’t here"
        intro="The link may be out of date, or the page has moved. These will get you back on track."
        cta={false}
      >
        <nav aria-label="Where to next" className="flex flex-wrap gap-3">
          <Button href={contactHref}>Contact us</Button>
          <Button href="/services" variant="secondary">
            Our services
          </Button>
          <Button href="/work" variant="secondary">
            Our work
          </Button>
        </nav>
      </PageHeader>
    </main>
  );
}
