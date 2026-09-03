import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import { ArrowRight, ICON_KINDS } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { AgentsTeaser } from "@/components/home/agents-teaser";
import { ControlDeck } from "@/components/home/control-deck";
import { Hero } from "@/components/home/hero";
import { ComponentMarquee } from "@/components/home/marquee";
import { Specimen } from "@/components/home/specimen";
import { ComponentWall } from "@/components/home/wall";

import { componentCount, docCount } from "@/lib/nav";
import { VESPER_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: "Vesper — Tenstorrent's design system",
  description:
    "A React component library built on shared design tokens, with light and dark themes, an icon set, and first-class Tailwind support.",
};

const Section = ({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  children: React.ReactNode;
}) => (
  <section className="home-section">
    <div className="home-section-head">
      <Typography as="div" variant="label-xs-mono" className="eyebrow">
        {eyebrow}
      </Typography>
      <Typography as="h2" variant="heading-xl" className="home-section-title">
        {title}
      </Typography>
      {copy && (
        <Typography variant="copy-md" className="home-section-copy">
          {copy}
        </Typography>
      )}
    </div>
    {children}
  </section>
);

export default function Page() {
  return (
    <div className="home">
      <Hero version={VESPER_VERSION} docCount={docCount} />

      <ComponentMarquee />

      <Section
        eyebrow="Interactive"
        title="Take the controls"
        copy="Fourteen Vesper components, wired to one piece of React state. Drag the clock, widen the power envelope, dispatch a kernel — the readout on the right is following along. Push it far enough and the panel will let you know."
      >
        <ControlDeck />
      </Section>

      <Section
        eyebrow={`${componentCount} components`}
        title="The whole library, at once"
        copy="Not screenshots. Every cell below is the real component, mounted and interactive. Hover one to find out what it is called, click through for the documentation."
      >
        <ComponentWall />
      </Section>

      <Section
        eyebrow="Foundations"
        title="Tokens all the way down"
        copy="Components are the visible part. Underneath is a set of CSS variables for colour, type, spacing, radius, shadow, and stroke that you can build your own UI from — and that resolve per theme without a second stylesheet."
      >
        <Specimen />
      </Section>

      <Section
        eyebrow="Machine readable"
        title="Written for humans, served to both"
      >
        <AgentsTeaser
          docCount={docCount}
          componentCount={componentCount}
          iconCount={ICON_KINDS.length}
        />
      </Section>

      <section className="outro">
        <Typography as="div" variant="label-xs-mono" className="eyebrow">
          Ready when you are
        </Typography>
        <Typography
          as="h2"
          variant="heading-2xl"
          style={{ letterSpacing: "-0.03em", maxWidth: "24ch" }}
        >
          One install, one stylesheet, and you are building
        </Typography>
        <Typography
          variant="copy-lg"
          style={{ color: "var(--vesper-text-secondary)", maxWidth: "48ch" }}
        >
          Every component has its own entrypoint, so your bundler only ships the
          ones you actually use.
        </Typography>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Button as={Link} href="/getting-started" iconRight={<ArrowRight />}>
            Get started
          </Button>
          <Button as={Link} href="/tokens" variant="tertiary">
            Read the token reference
          </Button>
        </div>
        <Typography
          variant="label-xs-mono"
          style={{ color: "var(--vesper-text-tertiary)" }}
        >
          psst — ⌘K searches everything, ⌥A is for the robots
        </Typography>
      </section>
    </div>
  );
}
