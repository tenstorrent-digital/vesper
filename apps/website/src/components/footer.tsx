import Link from "next/link";

import { SocialGitHub, Tenstorrent } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { GITHUB_URL } from "@/lib/constants";

interface FooterLink {
  href: string;
  label: string;
  /** links off the docs site open in a new tab */
  external?: boolean;
}

const groups: { label: string; links: FooterLink[] }[] = [
  {
    label: "Docs",
    links: [
      { href: "/getting-started", label: "Getting Started" },
      { href: "/components", label: "Components" },
      { href: "/tokens", label: "Tokens" },
    ],
  },
  {
    label: "Project",
    links: [
      { href: GITHUB_URL, label: "GitHub", external: true },
      {
        href: `${GITHUB_URL}/blob/main/CONTRIBUTING.md`,
        label: "Contributing",
        external: true,
      },
      {
        href: `${GITHUB_URL}/issues`,
        label: "Issues",
        external: true,
      },
    ],
  },
];

export const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Tenstorrent className="footer-mark" aria-hidden="true" />
          <Typography variant="heading-sm">Vesper</Typography>
          <Typography variant="copy-sm" className="footer-tagline">
            Tenstorrent&apos;s design system for the web.
          </Typography>
        </div>

        {groups.map(({ label, links }) => (
          <div key={label} className="footer-group">
            <Typography
              as="span"
              variant="label-xs-mono"
              className="footer-group-label"
            >
              {label}
            </Typography>
            {links.map(({ href, label, external }) => (
              <Typography
                key={href}
                as={Link}
                href={href}
                variant="copy-sm"
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {label}
              </Typography>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-baseline">
        <Typography variant="copy-xs" className="footer-copyright">
          © {new Date().getFullYear()} Tenstorrent Inc. Released under the MIT
          license.
        </Typography>
        <Typography
          as="a"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="copy-xs"
          className="footer-social"
          aria-label="Vesper on GitHub"
        >
          <SocialGitHub aria-hidden="true" />
        </Typography>
      </div>
    </footer>
  );
};
