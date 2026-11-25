import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RevealHeading } from "@/components/ui/reveal-heading";
import { team } from "@/data/team";
import { contactHref } from "@/lib/site";

export function TeamSection() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="container-page flex scroll-mt-24 flex-col gap-11 py-16 md:py-28"
    >
      <header className="flex max-w-xl flex-col items-start gap-8">
        <div className="flex flex-col gap-4">
          <p className="bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold">
            Team
          </p>
          <RevealHeading
            id="team-heading"
            className="heading-h2 font-sans text-balance"
          >
            Senior specialists, working as one{" "}
            <em className="accent-serif">team</em>
          </RevealHeading>
          <p className="text-small text-neutral-darkest/60">
            You work directly with the people designing, building and automating
            your project, from first call to launch.
          </p>
        </div>
        <Button href={contactHref} variant="secondary">
          Contact us
        </Button>
      </header>

      <ul className="grid gap-5 sm:grid-cols-3 sm:gap-3 md:gap-5">
        {team.map((member) => (
          <li
            key={member.photo.src}
            className="border-border flex flex-col gap-2 rounded-lg border p-1"
          >
            <div className="relative aspect-[380/372] overflow-hidden rounded-sm">
              <Image
                src={member.photo}
                alt={`Portrait of ${member.name}`}
                fill
                sizes="(min-width: 1520px) 472px, (min-width: 640px) 32vw, 100vw"
                className={member.framing}
              />
            </div>
            <div className="bg-neutral-lightest rounded-sm p-3.5">
              <RevealHeading
                as="h3"
                effect="none"
                stagger={0.1}
                className="heading-h6 font-serif"
              >
                {member.name}
              </RevealHeading>
              <p className="text-small text-neutral-darkest/60 mt-1 font-medium">
                {member.role}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
