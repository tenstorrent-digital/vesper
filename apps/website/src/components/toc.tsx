"use client";

import Link from "next/link";

import { Typography } from "@tenstorrent/vesper/typography";

import type { ToCItem } from "@/lib/filesystem/docs/types";
import { cn } from "@/lib/tailwind/cn";

export function ToC({ toc }: { toc: ToCItem[] }) {
  return (
    <aside
      className={cn(
        "sticky top-(--nav-scroll-margin)",
        "flex-col gap-vesper-1 xl:flex hidden",
        "w-3xs shrink-0 pl-vesper-4"
      )}
    >
      <Typography variant="label-lg-bold" className="mb-vesper-4">
        On this page
      </Typography>
      {toc.map((item) => (
        <Typography
          key={item.id}
          as={Link}
          variant="copy-sm"
          href={`#${item.id}`}
          className="hover:text-vesper-text-link-hover"
          style={{
            marginLeft: `calc(var(--vesper-spacing-3) * ${item.depth - 1})`,
          }}
        >
          {item.text}
        </Typography>
      ))}
    </aside>
  );
}
