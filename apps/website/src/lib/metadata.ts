import type { Metadata } from "next";

export function getMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  /** The path to the page, without the preceding slash, eg. `"components/admonition"` */
  path: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Vesper",
      url: `https://vesper.tenstorrent.com/${path}`,
    },
  };
}
