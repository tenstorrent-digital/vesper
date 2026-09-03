import Link from "next/link";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Menu } from "@tenstorrent/vesper/icons";
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
    <nav
      id="nav"
      aria-label="Main Navigation"
      className="order-1 flex w-full min-w-0 items-center justify-between gap-x-4 gap-y-2 border-b border-vesper-alpha-black-50 p-4 md:order-none md:col-span-2 md:row-start-1"
    >
      <div className="flex min-w-0 items-center gap-4">
        <Typography
          as={Link}
          href="/"
          id="home"
          variant="heading-sm"
          className="shrink-0 md:w-44"
        >
          Vesper
        </Typography>
        <Breadcrumbs titles={titles} />
      </div>
      <div className="flex w-fit shrink-0 items-center gap-1 md:gap-4">
        <PlaygroundLink />
        <IconButton
          aria-label="Scroll to component list at bottom of page"
          id="menu-link"
          as="a"
          href="#sidebar"
          size="sm"
          variant="ghost"
          icon={<Menu />}
          className="md:hidden"
        />
      </div>
    </nav>
  );
};
