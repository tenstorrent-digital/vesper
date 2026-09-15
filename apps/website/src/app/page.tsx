import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownPageContent } from "@/components/markdown-page-content";

import { docs, getDoc } from "@/lib/filesystem/docs";
import { loadDoc } from "@/lib/filesystem/docs/load";

// 404 paths not found at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ doc: slug }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = getDoc(["index"])?.frontmatter ?? {};

  return { title, description };
}

export default async function Page() {
  const entry = getDoc(["index"]);
  if (!entry) notFound();

  const { default: Doc } = await loadDoc(entry);

  return (
    <MarkdownPageContent toc={entry.toc}>
      <Doc />
    </MarkdownPageContent>
  );
}
