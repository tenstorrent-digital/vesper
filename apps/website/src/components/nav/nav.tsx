import Link from "next/link";

import { Typography } from "@tenstorrent/vesper/typography";

import { docs } from "@/lib/filesystem/docs";

import { Breadcrumbs } from "./breadcrumbs";
import { PlaygroundLink } from "./playground-link";

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
        <Typography as={Link} href="/" id="home" variant="heading-sm">
          Vesper
        </Typography>
        <Breadcrumbs titles={titles} />
      </div>
      <div className="nav-group">
        <PlaygroundLink />
      </div>
    </nav>
  );
};
