import Link from "next/link";

import { IconButton } from "@tenstorrent/vesper/icon-button";
import { Menu, Tenstorrent } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlaygroundLink } from "@/components/playground-link";

import { getPageTitles } from "@/lib/filesystem/docs";

import "@/lib/style/css/globals.css";

export function Nav() {
  return (
    <div className="border-vesper-border-tertiary bg-vesper-background-primary sticky top-0 z-20 h-(--nav-height) shrink-0 border-b">
      <div className="pr-vesper-4 flex h-full items-center">
        <div className="px-vesper-4 md:w-3xs">
          <Typography
            as={Link}
            href="/"
            variant="heading-sm"
            className="gap-vesper-2 pb-vesper-half flex h-full w-fit items-center"
          >
            <Tenstorrent width={24} color="var(--vesper-teal-500)" />
            Vesper
          </Typography>
        </div>
        <Breadcrumbs pageTitles={getPageTitles()} />
        <PlaygroundLink />
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
    </div>
  );
}
