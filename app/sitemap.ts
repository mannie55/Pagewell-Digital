import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/lib/site";

// Every page on the site. New routes go here (or come from their data file).
const routes = [
  "",
  "/about",
  "/contact",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/work",
  ...projects.map((p) => `/work/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
