import type { Metadata } from "next";

import { BASE_URL } from "./constants";

interface GetMetadataParams extends Omit<
  Metadata,
  "title" | "description" | "openGraph" | "metadataBase"
  > {
  title?: Metadata["title"];
  description?: string;
  /** The path to the page, with the preceding slash, eg. `"/components/admonition"` */
  path: string;
}

export function getMetadata({
  title,
  description,
  path,
  ...extra
}: GetMetadataParams): Metadata {
  // Throw so this fails when metadata paths are configured incorrectly at build time
  if (!path.startsWith("/")) {
    throw new Error(
      `paths passed to getMetadata must start with a slash. Received: "${path}"`,
    );
  }

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      siteName: "Vesper",
      url: new URL(`${BASE_URL}${path}`),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Vesper",
          type: "image/png",
        },

      ],
    },
  };

  if (title) {
    metadata.title = title;
    metadata.openGraph!.title = title;
  }

  if (description) {
    metadata.description = description;
    metadata.openGraph!.description = description;
  }

  return { ...extra, ...metadata };
}

export const METADATA_TITLE_DEFAULT = "Vesper";

export const METADATA_DESCRIPTION_DEFAULT =
  "Vesper is Tenstorrent's design system for React";

export const METADATA_TITLE_TEMPLATE = "Vesper | %s";
