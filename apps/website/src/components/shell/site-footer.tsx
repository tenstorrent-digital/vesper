import Link from "next/link";

import { Typography } from "@tenstorrent/vesper/typography";

import { GITHUB_URL } from "@/lib/constants";

export const SiteFooter = () => (
  <footer className="site-footer">
    <Typography variant="label-xs-mono">
      Vesper — Tenstorrent&apos;s design system for the web
    </Typography>

    <div className="site-footer-links">
      <Typography as={Link} href="/getting-started" variant="label-xs-mono">
        Getting Started
      </Typography>
      <Typography as={Link} href="/components" variant="label-xs-mono">
        Components
      </Typography>
      <Typography as={Link} href="/tokens" variant="label-xs-mono">
        Tokens
      </Typography>
      <Typography as={Link} href="/agents" variant="label-xs-mono">
        For Agents
      </Typography>
      <Typography
        as="a"
        href="/llms.txt"
        variant="label-xs-mono"
        title="A machine-readable map of this site"
      >
        llms.txt
      </Typography>
      <Typography
        as="a"
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="label-xs-mono"
      >
        GitHub
      </Typography>
    </div>
  </footer>
);
