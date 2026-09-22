import type { Metadata } from "next";

import { Typography } from "@tenstorrent/vesper/typography";

import { ComponentGrid } from "@/components/component-grid";

import { getMetadata } from "@/lib/metadata";

export const metadata: Metadata = getMetadata({
  title: "Components",
  description: "All available components in the Vesper design system.",
  path: "/components",
});

export default function Page() {
  return (
    <main className="gap-vesper-16 flex w-full flex-col">
      <div className="component-grid-header">
        <Typography variant="heading-2xl" as="h1">
          Components
        </Typography>
        <Typography
          variant="copy-md"
          className="mt-vesper-8 text-vesper-text-secondary"
        >
          All available components in the Vesper design system.
        </Typography>
      </div>
      <ComponentGrid />
    </main>
  );
}
