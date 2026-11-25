import Image from "next/image";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";

/**
 * A project's homepage, framed and floating over a blurred, accent-tinted copy
 * of itself. The backdrop requests a tiny image (sizes="64px"): the blur hides
 * the low resolution and it costs almost nothing to load.
 * `.work-shot` lets the framed site land a beat after its card (globals.css).
 */
export function ProjectMedia({
  project,
  sizes,
  priority = false,
  className,
}: {
  project: Project;
  /** `sizes` for the framed screenshot. */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ backgroundColor: project.accent }}
    >
      <Image
        src={project.image}
        alt=""
        aria-hidden
        fill
        sizes="64px"
        className="scale-125 object-cover opacity-70 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${project.accent}b3 0%, ${project.accent}4d 55%, rgb(27 27 27 / 0.6) 100%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-[8%]">
        <div className="w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div
            data-reveal
            className="work-shot relative aspect-[16/10] overflow-hidden rounded-md shadow-[0_30px_60px_-24px_rgb(0_0_0/0.65)] ring-1 ring-white/20"
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
