import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { projects, type Project } from "@/data/projects";
import { contactHref } from "@/lib/site";
import { ProjectMedia } from "./project-media";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    // Right-column cards start a beat later, so a row arrives left to right.
    <RevealOnScroll as="article" delay={index % 2 ? 0.15 : 0} duration={1}>
      <Link
        href={`/work/${project.slug}`}
        className="group flex flex-col gap-6 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <div className="relative">
          <ProjectMedia
            project={project}
            sizes="(min-width: 768px) 42vw, 84vw"
            className="aspect-[5/4]"
          />
          <span
            aria-hidden
            className="bg-flamingo absolute right-4 bottom-4 flex size-12 translate-y-2 items-center justify-center rounded-sm text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Always stacked: real names vary too much in length to share a row with the services. */}
          <div className="flex flex-col gap-2">
            <RevealHeading
              as="h3"
              effect="none"
              className="heading-h5 font-sans text-white"
            >
              {project.name}
            </RevealHeading>
            <ul
              className="text-small flex flex-wrap items-center gap-x-2 gap-y-1 text-white/60"
              aria-label="Services"
            >
              {project.services.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden className="text-white/30">
                      ·
                    </span>
                  )}
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-regular max-w-xl text-white/60">
            {project.summary}
          </p>
        </div>
      </Link>
    </RevealOnScroll>
  );
}

/** Two-column staggered grid: the right column sits lower (translate keeps reading order 1→4). */
export function ProjectGrid() {
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-24 md:pb-40 xl:gap-x-12">
      {projects.map((project, i) => (
        <li key={project.slug} className="md:even:translate-y-40">
          <ProjectCard project={project} index={i} />
        </li>
      ))}
    </ul>
  );
}

/** Selected work on the home page: the grid on a dark panel, then the CTA. */
export function WorkSection() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="bg-neutral-darker render-when-near scroll-mt-24 py-14 text-white md:py-28"
    >
      <div className="container-page flex flex-col gap-12 md:gap-20">
        <header className="flex flex-col gap-4">
          <p className="text-small w-fit rounded-sm bg-white/10 px-2 py-0.5 font-semibold text-white/60">
            Work
          </p>
          <RevealHeading
            id="work-heading"
            className="heading-h2 font-sans text-balance"
          >
            Selected <em className="accent-serif">work</em>
          </RevealHeading>
          <p className="text-regular md:text-medium max-w-xl text-white/60">
            Live websites we’ve built for businesses in the UK, Nigeria and
            Canada.
          </p>
        </header>

        <ProjectGrid />

        <div className="flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-small flex flex-col gap-1">
            <p>Your website could be next.</p>
            <p className="text-white/60">
              Start with a free audit: three written findings within two working
              days.
            </p>
          </div>
          <Button href={contactHref} tone="dark" size="sm">
            Get a free audit
          </Button>
        </div>
      </div>
    </section>
  );
}
