import type { ReactNode } from "react";
import Link from "next/link";

import { Typography } from "@tenstorrent/vesper/typography";

import type { ToCItem } from "@/lib/filesystem/docs/types";
import { cn } from "@/lib/tailwind/cn";

export function MarkdownPageContent({
  toc,
  children,
}: {
  toc: ToCItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <main className="prose min-w-0">{children}</main>
      <aside
        className={cn(
          "sticky top-(--nav-scroll-margin)",
          "gap-vesper-1 hidden flex-col xl:flex",
          "pl-vesper-4 w-3xs shrink-0"
        )}
      >
        <Typography variant="label-lg-bold" className="mb-vesper-4">
          On this page
        </Typography>
        {toc.map((item) => (
          <Typography
            key={item.id}
            as={Link}
            variant="copy-xs"
            href={`#${item.id}`}
            className="text-vesper-text-tertiary hover:underline"
            style={{
              marginLeft: `calc(var(--vesper-spacing-3) * ${item.depth - 1})`,
            }}
          >
            {item.text}
          </Typography>
        ))}
      </aside>
    </div>
  );
}
