"use client";

import Link from "next/link";

import { Typography } from "@tenstorrent/vesper/typography";

import type { ToCItem } from "@/lib/filesystem/docs/types";

export function ToC({ toc }: { toc: ToCItem[] }) {
  return (
    <aside>
      {toc.map((item) => (
        <Typography
          key={item.id}
          as={Link}
          variant="copy-sm"
          href={`#${item.id}`}
          className="hover:text-vesper-text-link-hover"
          style={{
            marginLeft: `calc(var(--vesper-spacing-2) * ${item.depth})`,
          }}
        >
          {item.text}
        </Typography>
      ))}
    </aside>
  );
}
