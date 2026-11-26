import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { RevealHeading } from "@/components/ui/reveal-heading";
import {
  contactDetails,
  contactHref,
  copyrightYear,
  footerSections,
  legalLinks,
  site,
  socialLinks,
} from "@/lib/site";
import clutchIcon from "@/public/icons/social/clutch.svg";
import linkedinIcon from "@/public/icons/social/linkedin.svg";
import teamHuddle from "@/public/images/footer/team-huddle.png";

const socialIcons = { linkedin: linkedinIcon, clutch: clutchIcon };

const linkClass =
  "tap-target text-regular md:text-medium hover:text-flamingo-dark rounded-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
const groupLabel = "text-tiny text-muted font-semibold";
const detailLabel = "text-small text-muted";

export function SiteFooter() {
  return (
    <footer className="container-page flex flex-col gap-12 py-12">
      <RevealHeading as="p" className="heading-h5 font-sans">
        Design-led. <br />
        AI-powered.
      </RevealHeading>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)] xl:gap-24">
        <div className="bg-neutral-darker flex flex-col items-start gap-8 rounded-lg p-4 pb-12 text-white md:p-6 md:pb-12">
          <div className="relative aspect-[433/290] w-full overflow-hidden rounded-sm">
            <Image
              src={teamHuddle}
              alt="A group of colleagues huddled together, smiling down at the camera"
              fill
              sizes="(min-width: 1024px) 432px, 100vw"
              className="-scale-x-100 object-cover"
            />
          </div>
          <RevealHeading className="text-large font-medium">
            Bring us the goal. <br />
            We’ll build the plan.
          </RevealHeading>
          <Button href={contactHref} tone="dark" size="sm">
            Contact us
          </Button>
        </div>

        <div className="flex flex-col justify-between gap-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[auto_auto_auto] md:justify-between">
            <nav aria-label="Sections" className="flex flex-col gap-5">
              <p className={groupLabel}>Sections</p>
              <ul className="flex flex-col gap-0.5">
                {footerSections.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Services" className="flex flex-col gap-5">
              <p className={groupLabel}>Services</p>
              <ul className="flex flex-col gap-0.5">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className={linkClass}
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
              <p className={groupLabel}>Contact</p>
              <dl className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <dt className={detailLabel}>Email</dt>
                  <dd className="text-small">
                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="tap-target hover:text-flamingo-dark rounded-sm wrap-anywhere transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {contactDetails.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className={detailLabel}>Whatsapp</dt>
                  <dd className="text-small">{contactDetails.whatsapp}</dd>
                </div>
                <div className="flex flex-col gap-3">
                  <dt className={detailLabel}>Social</dt>
                  <dd className="flex gap-2">
                    {socialLinks.map((social) => {
                      const icon = (
                        <Image
                          src={socialIcons[social.icon]}
                          alt={social.href ? "" : social.label}
                          width={20}
                          height={20}
                          className="size-5 object-contain"
                        />
                      );
                      const tile =
                        "bg-tint flex size-11 items-center justify-center rounded-sm";
                      return social.href ? (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={`${site.name} on ${social.label}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          className={`${tile} hover:bg-tint-strong transition-colors`}
                        >
                          {icon}
                        </a>
                      ) : (
                        <span key={social.label} className={tile}>
                          {icon}
                        </span>
                      );
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="text-tiny text-muted flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-medium">
            <p>
              © {copyrightYear} {site.name}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="tap-target hover:text-neutral-darkest transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
