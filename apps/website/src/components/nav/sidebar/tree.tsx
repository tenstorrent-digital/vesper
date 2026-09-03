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
    <div className="flex flex-col gap-0">
      {folder && (
        <Typography
          as="span"
          className="p-2 uppercase text-vesper-alpha-black-600"
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
          className="-my-0.5 rounded-vesper-2 p-2 hover:bg-vesper-state-neutral-hover data-[active]:bg-vesper-state-neutral-active"
        >
          {title ?? convertKebabToTitleCase(href.split("/").pop() ?? "")}
        </Typography>
      ))}
    </div>
  );
};
