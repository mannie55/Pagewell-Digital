import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Add each new route here (or generate from content) as pages are built.
const routes = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
