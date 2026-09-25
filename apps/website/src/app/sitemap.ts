import { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import { getDocsSlugs } from "@/lib/filesystem/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/components` },
    ...getDocsSlugs().map((slug) => ({
      url: `${BASE_URL}/${slug.join("/")}`,
    })),
  ];
}
