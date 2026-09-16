import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { CopyToClipboardButton } from "@/components/copy-to-clipboard-button";
import TableOfContents from "@/components/table-of-contents";

import { getDoc, markdownFileAsPrompt } from "@/lib/filesystem/docs";

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
      <TableOfContents items={entry.toc} />
    </div>
  );
}
