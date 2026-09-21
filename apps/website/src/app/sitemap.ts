import { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/constants";
import { docs } from "@/lib/filesystem/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL },
    { url: `${BASE_URL}/components` },
    ...docs.map((doc) => ({
      url: `${BASE_URL}/${doc.slug.join("/")}`,
    })),
  ];
}
