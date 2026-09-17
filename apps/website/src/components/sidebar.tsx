"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import type { getSidebarData } from "@/lib/filesystem/docs";
import { convertKebabToTitleCase } from "@/lib/filesystem/utils";
import { cn } from "@/lib/tailwind/cn";

export function Sidebar({ data }: { data: ReturnType<typeof getSidebarData> }) {
  const pathname = usePathname();

  return (
    <nav
      id="sidebar"
      aria-label="Sidebar"
      className={cn(
        "p-vesper-4 w-full overflow-auto md:h-(--below-nav-height) md:w-[12.5rem]",
        "scroll-mt-(--nav-scroll-margin) md:sticky md:top-(--nav-height)",
      )}
    >
      {data.map(({ folder, pages }) => (
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
      <Typography
        className="mt-vesper-8 p-vesper-2 rounded-vesper-2 hover:bg-vesper-background-tertiary data-active:bg-vesper-background-tertiary block md:hidden"
        as="a"
        href="#"
        variant="label-lg-bold"
      >
        Back to Top ↑
      </Typography>
    </nav>
  );
}
