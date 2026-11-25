import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { ProjectMedia } from "@/components/sections/project-media";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };


export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name}: ${project.industry} website`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-small text-neutral-darkest/55">{term}</dt>
      <dd className="text-regular font-medium">{children}</dd>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const host = new URL(project.url).hostname.replace(/^www\./, "");

  return (
    <main>
      <PageHeader
        crumbs={[{ label: "Work", href: "/work" }, { label: project.name }]}
        label={project.industry}
        title={project.name}
        intro={project.summary}
      >
        <dl className="border-border grid grid-cols-2 gap-6 border-t pt-6 md:grid-cols-4">
          <Fact term="Market">{project.market}</Fact>
          <Fact term="Industry">{project.industry}</Fact>
          <Fact term="What we did">{project.services.join(", ")}</Fact>
          <Fact term="Live site">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="decoration-neutral-darkest/30 hover:decoration-neutral-darkest inline-flex items-center gap-1 underline underline-offset-4"
            >
              {host}
              <ArrowUpRight weight="bold" aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Fact>
        </dl>
      </PageHeader>

      <div className="container-page">
        <RevealOnScroll duration={1}>
          <ProjectMedia
            project={project}
            priority
            sizes="(min-width: 1024px) 80vw, 92vw"
            className="aspect-[4/3] md:aspect-[16/9]"
          />
        </RevealOnScroll>
      </div>

      <section
        aria-labelledby="about-project"
        className="container-page grid gap-10 py-16 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
      >
        <h2 id="about-project" className="heading-h4 font-sans">
          About the project
        </h2>
        <div className="flex flex-col gap-10">
          <p className="text-medium text-neutral-darkest/75 max-w-2xl">
            {project.overview}
          </p>
          <div className="flex flex-col gap-4">
            <h3 className="heading-h6 font-sans font-medium">
              What the website does
            </h3>
            <ul className="flex flex-col gap-3">
              {project.built.map((item) => (
                <li key={item} className="text-regular flex gap-3">
                  <CheckCircle
                    weight="fill"
                    aria-hidden
                    className="text-flamingo-dark mt-0.5 size-5 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              iconRight={
                <ArrowUpRight weight="bold" aria-hidden className="size-4" />
              }
            >
              Visit the live site
              <span className="sr-only">(opens in a new tab)</span>
            </Button>
            <Button href={`/work/${next.slug}`} variant="secondary">
              Next: {next.name}
            </Button>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
