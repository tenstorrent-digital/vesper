import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import { navPages } from "@/lib/nav";

/** every page on the site, for crawlers (referenced from `/robots.txt`) */
export default function sitemap(): MetadataRoute.Sitemap {
  return navPages.map(({ href }) => ({
    url: `${BASE_URL}${href}`,
    changeFrequency: "weekly",
    priority: href === "/" ? 1 : 0.7,
  }));
}
