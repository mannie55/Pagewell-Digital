import type { StaticImageData } from "next/image";
import placeholder from "@/public/images/work/project-placeholder.jpg";

export type Project = {
  slug: string;
  name: string;
  /** One line on what we did / the outcome. Shown under the image and indexed by search engines. */
  summary: string;
  services: string[];
  image: StaticImageData;
  imageAlt: string;
  /** Case-study URL. Leave undefined until the page exists so we never link to a 404. */
  href?: string;
};

// PLACEHOLDER CONTENT — names come from the Figma frame; summaries, services and
// images must be replaced with real client work before launch.
export const projects: Project[] = [
  {
    slug: "aurora-skincare",
    name: "Aurora Skincare",
    summary: "A Shopify storefront and brand refresh for a clean-beauty label.",
    services: ["Web design", "E-commerce"],
    image: placeholder,
    imageAlt: "Aurora Skincare website shown on desktop and mobile",
  },
  {
    slug: "northwind-coffee",
    name: "Northwind Coffee",
    summary:
      "Subscriptions, wholesale ordering and a site that loads fast on mobile.",
    services: ["Development", "E-commerce"],
    image: placeholder,
    imageAlt: "Northwind Coffee online shop product page",
  },
  {
    slug: "atlas-fitness",
    name: "Atlas Fitness",
    summary:
      "Class booking, automated follow-up emails and local SEO for three gyms.",
    services: ["Development", "AI & automation", "SEO"],
    image: placeholder,
    imageAlt: "Atlas Fitness class timetable and booking screens",
  },
  {
    slug: "lumen-interiors",
    name: "Lumen Interiors",
    summary: "A portfolio site that lets the studio’s photography lead.",
    services: ["Web design", "SEO"],
    image: placeholder,
    imageAlt: "Lumen Interiors portfolio homepage with interior photography",
  },
];
