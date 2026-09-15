"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import type { DocGroup } from "@/lib/filesystem/docs";
import { convertKebabToTitleCase } from "@/lib/filesystem/utils";
import { cn } from "@/lib/tailwind/cn";

export function Sidebar({ tree }: { tree: DocGroup[] }) {
  const pathname = usePathname();

  const groups = useMemo(
    () =>
      tree.map(({ folder, docs }) => ({
        folder,
        pages: docs
          .filter((doc) => !(doc.slug.length === 1 && doc.slug[0] === "index"))
          .map(({ href, frontmatter }) => ({
            href,
            title: frontmatter.title,
          })),
      })),
    [tree]
  );

  return (
    <nav
      id="sidebar"
      className={cn(
        "p-vesper-4 overflow-auto md:h-(--below-nav-height) md:w-3xs",
        "scroll-mt-(--nav-scroll-margin) md:sticky md:top-(--nav-height)"
      )}
    >
      {groups.map(({ folder, pages }) => (
        <div key={folder ?? "root"} className="gap-vesper-micro flex flex-col">
          {folder && (
            <Typography
              as="span"
              variant="label-xs-mono"
              className="p-vesper-2 mt-vesper-4 text-vesper-text-tertiary uppercase"
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
              className="p-vesper-2 rounded-vesper-2 hover:bg-vesper-background-tertiary data-active:bg-vesper-background-tertiary"
              variant="label-lg-bold"
            >
              {title ?? convertKebabToTitleCase(href.split("/").pop() ?? "")}
            </Typography>
          ))}
        </div>
      ))}
    </nav>
  );
}
