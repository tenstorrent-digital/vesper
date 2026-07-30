"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

export interface TreePage {
  href: string;
  /** falls back to the slug when a document has no frontmatter title */
  title?: string;
}

export const Tree = ({ pages }: { pages: TreePage[] }) => {
  const pathname = usePathname();

  return (
    <>
      {pages.map(({ href, title }) => (
        <Typography
          as={Link}
          href={href}
          data-active={pathname === href || undefined}
          key={href}
          variant="heading-xs"
        >
          {title ?? convertKebabToTitleCase(href.split("/").pop() ?? "")}
        </Typography>
      ))}
    </>
  );
};
