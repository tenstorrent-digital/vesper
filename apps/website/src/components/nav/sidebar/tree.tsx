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

export const Tree = ({
  folder,
  pages,
}: {
  /** the folder these pages came from, rendered as a group label */
  folder?: string;
  pages: TreePage[];
}) => {
  const pathname = usePathname();

  return (
    <div className="sidebar-group">
      {folder && (
        <Typography
          as="span"
          className="sidebar-group-label"
          variant="label-xs-mono"
        >
          {convertKebabToTitleCase(folder)}
        </Typography>
      )}

      {pages.map(({ href, title }) => (
        <Typography
          as={Link}
          href={href}
          data-active={pathname === href || undefined}
          aria-current={pathname === href ? "page" : undefined}
          key={href}
          variant="heading-xs"
        >
          {title ?? convertKebabToTitleCase(href.split("/").pop() ?? "")}
        </Typography>
      ))}
    </div>
  );
};
