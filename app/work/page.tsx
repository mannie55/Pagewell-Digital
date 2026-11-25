import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { ProjectGrid } from "@/components/sections/work-section";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Live websites Pagewell has built for businesses in the UK, Nigeria and Canada, each with a short write-up and a link to the real site.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main>
      <PageHeader
        crumbs={[{ label: "Work" }]}
        title={
          <>
            Websites built to do a <em className="accent-serif">job</em>
          </>
        }
        intro="Live websites we’ve built for businesses in the UK, Nigeria and Canada. Each one has a short write-up and a link to the real site."
      />
      <section
        aria-labelledby="projects-heading"
        className="mb-14 py-14 scheme-dark md:mb-28 md:py-28"
      >
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>
        <div className="container-page">
          <ProjectGrid />
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
