"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import {
  ArrowRight,
  ICON_KINDS,
  SocialGitHub,
} from "@tenstorrent/vesper/icons";
import { Snippet } from "@tenstorrent/vesper/snippet";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Typography } from "@tenstorrent/vesper/typography";

import { SHOWCASE } from "@/components/showcase/registry";

import { GITHUB_URL, PACKAGE_NAME } from "@/lib/constants";

const INSTALL: Record<string, string> = {
  npm: `npm install ${PACKAGE_NAME}`,
  yarn: `yarn add ${PACKAGE_NAME}`,
  pnpm: `pnpm add ${PACKAGE_NAME}`,
  bun: `bun add ${PACKAGE_NAME}`,
};

const WORDMARK = "VESPER".split("");

export const Hero = ({
  version,
  docCount,
}: {
  version: string;
  docCount: number;
}) => {
  const [manager, setManager] = useState("npm");

  return (
    <section className="hero">
      <Typography as="div" variant="label-xs-mono" className="eyebrow">
        Tenstorrent · design system · v{version}
      </Typography>

      <h1 className="hero-wordmark gradient-text" aria-label="Vesper">
        {WORDMARK.map((letter, index) => (
          <span key={index} className="hero-letter" aria-hidden="true">
            {letter}
          </span>
        ))}
      </h1>

      <Typography variant="copy-xl" className="hero-lede">
        A React component library built on a shared set of design tokens — light
        and dark themes, {ICON_KINDS.length} icons, and first-class Tailwind
        support. Everything below this line is the real thing, running live.
      </Typography>

      <div className="hero-install">
        <Toggle
          size="sm"
          value={manager}
          onValueChange={setManager}
          options={Object.keys(INSTALL).map((name) => ({
            text: name,
            value: name,
          }))}
        />
        <Snippet style={{ flex: 1, minWidth: "16rem" }}>
          {INSTALL[manager]}
        </Snippet>
      </div>

      <div className="hero-actions">
        <Button as={Link} href="/getting-started" iconRight={<ArrowRight />}>
          Get started
        </Button>
        <Button as={Link} href="/components" variant="tertiary">
          Browse components
        </Button>
        <Button
          as="a"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          iconLeft={<SocialGitHub />}
        >
          Source
        </Button>
      </div>

      <div className="hero-strip">
        <div className="stat">
          <Typography as="span" variant="heading-md" className="stat-value">
            {SHOWCASE.length}
          </Typography>
          <Typography as="span" variant="label-xs-mono" className="stat-label">
            Components
          </Typography>
        </div>
        <div className="stat">
          <Typography as="span" variant="heading-md" className="stat-value">
            {ICON_KINDS.length}
          </Typography>
          <Typography as="span" variant="label-xs-mono" className="stat-label">
            Icons
          </Typography>
        </div>
        <div className="stat">
          <Typography as="span" variant="heading-md" className="stat-value">
            {docCount}
          </Typography>
          <Typography as="span" variant="label-xs-mono" className="stat-label">
            Documents
          </Typography>
        </div>
        <div className="stat">
          <Typography as="span" variant="heading-md" className="stat-value">
            AA
          </Typography>
          <Typography as="span" variant="label-xs-mono" className="stat-label">
            WCAG 2, both themes
          </Typography>
        </div>
        <div
          className="stat"
          style={{ justifyContent: "center", marginLeft: "auto" }}
        >
          <StatusIndicator state="ready" label="All systems nominal" animated />
        </div>
      </div>
    </section>
  );
};
