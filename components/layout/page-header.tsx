import Link from "next/link";
import type { ReactNode } from "react";
import { HandoffNavCta } from "@/components/ui/handoff-nav";
import { contactHref } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Top of every inner page: breadcrumb trail, optional label, the page's one
 * h1, an intro line and the page's "Get a free audit" button, which the nav
 * catches on scroll (as it does the hero's). Extra content goes in `children`.
 */
export function PageHeader({
  crumbs,
  label,
  title,
  intro,
  cta = true,
  children,
}: {
  crumbs: Crumb[];
  label?: string;
  title: ReactNode;
  intro?: string;
  /** Show the CTA. Off on the contact page itself. */
  cta?: boolean;
  children?: ReactNode;
}) {
  return (
    <header className="container-page flex flex-col gap-6 pt-12 pb-12 md:pt-20 md:pb-16">
      <nav aria-label="Breadcrumb">
        <ol className="text-small text-neutral-darkest/60 flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="hover:text-neutral-darkest underline-offset-4 hover:underline"
            >
              Home
            </Link>
          </li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {c.href ? (
                <Link
                  href={c.href}
                  className="hover:text-neutral-darkest underline-offset-4 hover:underline"
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-neutral-darkest">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {label && (
        <p className="bg-neutral-darkest/5 text-small text-neutral-darkest/60 w-fit rounded-sm px-2 py-0.5 font-semibold">
          {label}
        </p>
      )}
      <h1 className="heading-h2 max-w-4xl font-sans text-balance">{title}</h1>
      {intro && (
        <p className="text-regular md:text-medium text-neutral-darkest/65 max-w-2xl">
          {intro}
        </p>
      )}
      {cta && (
        <div>
          <HandoffNavCta href={contactHref}>Get a free audit</HandoffNavCta>
        </div>
      )}
      {children}
    </header>
  );
}
