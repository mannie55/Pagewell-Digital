import { Eye, Handshake, Globe } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CtaBand } from "@/components/sections/cta-band";
import { ProcessSection } from "@/components/sections/process-section";
import { TeamSection } from "@/components/sections/team-section";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pagewell is a small team of designers, developers and growth specialists building websites that bring in customers for growing businesses.",
  alternates: { canonical: "/about" },
};

const beliefs: {
  icon: ReactNode;
  title: string;
  body: string;
  fill: string;
}[] = [
  {
    icon: <Handshake weight="fill" />,
    title: "Small on purpose",
    body: "The people you talk to are the people who do the work. No account managers in between.",
    fill: "bg-flamingo-lightest",
  },
  {
    icon: <Eye weight="fill" />,
    title: "Honest about results",
    body: "We never promise rankings. We promise the work, show you what changed every month, and say plainly what isn’t working.",
    fill: "bg-neutral-darkest/5",
  },
  {
    icon: <Globe weight="fill" />,
    title: "Wherever your customers are",
    body: "We work with businesses on three continents, and every project starts with how your customers actually search.",
    fill: "bg-neutral-darkest/5",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        crumbs={[{ label: "About" }]}
        title={
          <>
            A small team that builds websites to be{" "}
            <em className="accent-serif">found</em>
          </>
        }
        intro="Pagewell is a team of designers, developers and growth specialists. We build websites for growing businesses, then keep working on them until they bring in customers."
      />
      <section
        aria-label="What we believe"
        className="container-page grid gap-3 pb-16 md:grid-cols-2 md:pb-24 lg:grid-cols-3"
      >
        <RevealOnScroll className="bg-neutral-darkest relative flex min-h-64 flex-col justify-end overflow-hidden rounded-lg p-5 text-white md:col-span-2 md:p-10 lg:col-span-3">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.2)_1.3px,transparent_1.7px)] [mask-image:radial-gradient(70%_120%_at_100%_0%,black,transparent_70%)] bg-size-[14px_14px]"
          />
          <p className="heading-h3 relative max-w-3xl font-sans leading-snug text-balance">
            A website isn’t finished when it launches. It’s finished when it
            brings you{" "}
            <em className="accent-serif text-flamingo-light">customers</em>.
          </p>
        </RevealOnScroll>
        {beliefs.map((b, i) => (
          <RevealOnScroll
            key={b.title}
            delay={0.1 + i * 0.1}
            className={cn("flex flex-col gap-8 rounded-lg p-6 md:p-8", b.fill)}
          >
            <span
              aria-hidden
              className="bg-flamingo-dark flex size-11 items-center justify-center rounded-sm text-white [&>svg]:size-6"
            >
              {b.icon}
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="heading-h6 font-sans font-medium">{b.title}</h2>
              <p className="text-regular text-neutral-darkest/65">{b.body}</p>
            </div>
          </RevealOnScroll>
        ))}
      </section>
      <TeamSection />
      <ProcessSection />
      <CtaBand />
    </main>
  );
}
