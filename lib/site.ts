// Single source of truth for site-wide details used in metadata, sitemap and UI.
export const site = {
  name: "Pagewell Digital",
  description:
    "Pagewell designs, ranks and improves websites for businesses in the UK and Nigeria, so the right people find you, trust you and get in touch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

// Primary navigation: inner pages, plus the Process section on the home page.
export const mainNav = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
] as const;

/** The one conversion page: every "Get a free audit" button points here. */
export const contactHref = "/contact";

// Footer content. Items without an `href` have no destination yet and render as plain text.
export const footerSections = [
  ...mainNav,
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: contactHref },
] as const;

// PLACEHOLDERS: replace the WhatsApp number, add the social URLs and the legal
// page links before launch.
export const contactDetails = {
  email: "hello@pagewell.agency",
  whatsapp: "+00000000",
} as const;

export const socialLinks: {
  label: string;
  icon: "linkedin" | "clutch";
  href?: string;
}[] = [
  { label: "LinkedIn", icon: "linkedin" },
  { label: "Clutch", icon: "clutch" },
];

export const legalLinks: { label: string; href?: string }[] = [
  { label: "Terms & Conditions" },
  { label: "Privacy Policy" },
  { label: "Cookie Policy" },
];

export const copyrightYear = 2026;
