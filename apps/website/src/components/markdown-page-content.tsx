import type { ReactNode } from "react";

import { Typography } from "@tenstorrent/vesper/typography";

import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button";

import type { ToCItem } from "@/lib/filesystem/docs/types";
import { cn } from "@/lib/tailwind/cn";

export function MarkdownPageContent({
  raw,
  toc,
  children,
}: {
  raw: string;
  toc: ToCItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="gap-vesper-12 flex min-w-0 flex-col">
        <main className="prose">{children}</main>
        <div className="border-vesper-border-tertiary pt-vesper-12 flex justify-end border-t">
          <CopyToClipboardButton textToCopy={raw} size="xs" variant="tertiary">
            copy page as markdown
          </CopyToClipboardButton>
        </div>
      </div>
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
            as="a"
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
