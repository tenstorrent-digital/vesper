import Link from "next/link";

import { Button } from "@tenstorrent/vesper/button";
import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Menu, Tenstorrent } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { getPageTitles } from "@/lib/filesystem/docs";

import { Breadcrumbs } from "./breadcrumbs";
import { PlaygroundLink } from "./playground-link";

import "@/lib/style/css/globals.css";

const pageTitles = getPageTitles();

export function Nav() {
  return (
    <nav
      aria-label="Main Navigation"
      className="border-vesper-border-tertiary bg-vesper-background-primary sticky top-0 z-20 h-(--nav-height) shrink-0 border-b"
    >
      <div className="px-vesper-4 mx-auto flex h-full w-full max-w-7xl items-center">
        <div className="pr-vesper-4 pl-vesper-1 md:w-[12.5rem]">
          <Typography
            as={Link}
            href="/"
            variant="heading-sm"
            aria-label="Go to Vesper documentation homepage"
            className="gap-vesper-2 pb-vesper-half flex h-full w-fit items-center"
          >
            <Tenstorrent width={24} color="var(--vesper-teal-500)" />
            <span className="hidden sm:inline">Vesper</span>
          </Typography>
        </div>
        <Breadcrumbs pageTitles={pageTitles} />
        <div className="gap-vesper-2 flex">
          <PlaygroundLink />
          <Button
            as="a"
            target="_blank"
            href="/llms.txt"
            variant="tertiary"
            size="sm"
          >
            llms.txt
          </Button>
        </div>
        <IconButton
          aria-label="Scroll to documentation navigation"
          size="sm"
          variant="ghost"
          icon={<Menu />}
          as="a"
          href="#sidebar"
          className="ml-vesper-2 flex md:hidden"
        />
      </div>
    </nav>
  );
}
