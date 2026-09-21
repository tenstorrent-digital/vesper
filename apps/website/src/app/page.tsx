import type { Metadata } from "next";
import Link from "next/link";

import { Material } from "@tenstorrent/vesper/material";
import { Snippet } from "@tenstorrent/vesper/snippet";
import { Typography } from "@tenstorrent/vesper/typography";

import { VESPER_SUMMARY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Vesper",
  description: "Vesper is Tenstorrent's design system for React",
};

export default function Page() {
  return (
    <main className="prose">
      <Typography as="h1" variant="heading-2xl">
        Vesper
      </Typography>
      <Typography variant="copy-lg" className="whitespace-normal">
        {VESPER_SUMMARY}
      </Typography>
      <Snippet>npm install @tenstorrent/vesper</Snippet>
      <div className="gap-vesper-4 grid sm:grid-cols-2">
        <Material
          as={Link}
          href="/getting-started"
          variant="interactive"
          className="gap-vesper-1 p-vesper-6 flex flex-col"
        >
          <Typography variant="heading-sm">Getting Started</Typography>
          <Typography
            variant="copy-sm"
            className="home-card-description text-vesper-text-secondary whitespace-normal"
          >
            Install the package, import the styles, and load the fonts.
          </Typography>
        </Material>
        <Material
          as={Link}
          href="/components"
          variant="interactive"
          className="gap-vesper-1 p-vesper-6 flex flex-col"
        >
          <Typography variant="heading-sm">Components</Typography>
          <Typography
            variant="copy-sm"
            className="home-card-description text-vesper-text-secondary whitespace-normal"
          >
            Browse every component, with live examples and prop tables.
          </Typography>
        </Material>
        <Material
          as={Link}
          href="/tokens"
          variant="interactive"
          className="gap-vesper-1 p-vesper-6 flex flex-col"
        >
          <Typography variant="heading-sm">Tokens</Typography>
          <Typography
            variant="copy-sm"
            className="home-card-description text-vesper-text-secondary whitespace-normal"
          >
            The CSS primitives every component is built from.
          </Typography>
        </Material>
        <Material
          as="a"
          href="/storybook"
          target="_blank"
          rel="noopener noreferrer"
          variant="interactive"
          className="gap-vesper-1 p-vesper-6 flex flex-col"
        >
          <Typography variant="heading-sm">Playground</Typography>
          <Typography
            variant="copy-sm"
            className="home-card-description text-vesper-text-secondary whitespace-normal"
          >
            Try every component and prop combination in Storybook.
          </Typography>
        </Material>
      </div>
    </main>
  );
}
