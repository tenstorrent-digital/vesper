import type { Metadata } from "next";

export function getMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  /** The path to the page, with the preceding slash, eg. `"/components/admonition"` */
  path: string;
}): Metadata {
  // Throw so this fails when metadata paths are configured incorrectly at build time
  if (!path.startsWith("/")) {
    throw new Error(
      `paths passed to getMetadata must start with a slash. Received: "${path}"`,
    );
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Vesper",
      url: `https://vesper.tenstorrent.com${path}`,
    },
  };
}
