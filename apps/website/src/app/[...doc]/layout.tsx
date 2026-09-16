import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button";

import { getDoc, markdownFileAsPrompt } from "@/lib/filesystem/docs";
import { cn } from "@/lib/tailwind/cn";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ doc: string[] }>;
}) {
  const { doc } = await params;
  const entry = getDoc(doc);
  if (!entry) notFound();

  return (
    <div className="flex items-start justify-between">
      <div className="gap-vesper-12 flex min-w-0 flex-col">
        <main className="prose">{children}</main>
        <div className="border-vesper-border-tertiary pt-vesper-12 gap-vesper-4 flex justify-end border-t">
          {entry.frontmatter.title && (
            <CopyToClipboardButton
              textToCopy={markdownFileAsPrompt(
                entry.frontmatter.title,
                entry.raw,
              )}
              size="xs"
              variant="tertiary"
            >
              copy as prompt
            </CopyToClipboardButton>
          )}
          <CopyToClipboardButton
            textToCopy={entry.raw}
            size="xs"
            variant="tertiary"
          >
            copy as markdown
          </CopyToClipboardButton>
        </div>
      </div>
      <aside
        className={cn(
          "sticky top-(--nav-scroll-margin)",
          "gap-vesper-1 hidden flex-col xl:flex",
          "pl-vesper-4 w-3xs shrink-0",
        )}
      >
        <Typography variant="label-lg-bold" className="mb-vesper-4">
          On this page
        </Typography>
        {entry.toc.map((item) => (
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
