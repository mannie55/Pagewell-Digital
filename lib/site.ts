// Single source of truth for site-wide details used in metadata, sitemap and UI.
export const site = {
  name: "Pagewell Digital",
  description:
    "AI-augmented strategy, design and development for businesses and e-commerce brands that need a website built to perform and grow.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

// Primary navigation. Anchors point at landing-page sections by id.
export const mainNav = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
] as const;

export const contactHref = "/#contact";

// Footer content. Items without an `href` have no destination yet and render as plain text.
export const footerSections = [
  ...mainNav,
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: contactHref },
] as const;

export const footerServices = [
  "Full Website",
  "Full WebApp",
  "AI Automation",
  "Website Design",
  "WordPress",
  "Landing Pages",
  "CMS Architecture",
  "SEO & AEO Setup",
  "Website Migration",
  "Webflow Development",
  "Shopify Development",
  "Custom Development",
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
