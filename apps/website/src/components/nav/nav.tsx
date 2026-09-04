import Link from "next/link";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Menu, SocialGitHub, Tenstorrent } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { GITHUB_URL } from "@/lib/constants";
import { docs } from "@/lib/filesystem/docs";

import { Breadcrumbs } from "./breadcrumbs";
import { PlaygroundLink } from "./playground-link";
import { ThemeToggle } from "./theme-toggle";

/**
 * document titles by route, so the (client) breadcrumbs can label a segment
 * with its frontmatter title without reading the filesystem
 */
const titles = Object.fromEntries(
  docs.flatMap(({ href, frontmatter }) =>
    frontmatter.title ? [[href, frontmatter.title]] : [],
  ),
);

export const Nav = () => {
  return (
    <nav id="nav" aria-label="Main Navigation">
      <div className="nav-group nav-left">
        <Link href="/" id="home" aria-label="Vesper home">
          <Tenstorrent className="home-mark" aria-hidden="true" />
          <Typography as="span" variant="heading-sm">
            Vesper
          </Typography>
        </Link>
        <Breadcrumbs titles={titles} />
      </div>
      <div className="nav-group nav-right">
        <ThemeToggle className="theme-toggle" />
        <IconButton
          aria-label="Vesper on GitHub"
          id="github-link"
          as="a"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          size="sm"
          variant="ghost"
          icon={<SocialGitHub />}
        />
        <PlaygroundLink />
        <IconButton
          aria-label="Scroll to component list at bottom of page"
          id="menu-link"
          as="a"
          href="#sidebar"
          size="sm"
          variant="ghost"
          icon={<Menu />}
        />
      </div>
    </nav>
  );
};
