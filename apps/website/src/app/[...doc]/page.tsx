/**
 * renders every `.md`/`.mdx` file in the monorepo root `docs/` folder
 *
 * (page routes declared explicitly in `src/app` (eg. `/components`) will
 * take precedence over this catch-all route)
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { docs, getDoc } from "@/lib/filesystem/docs";
import { loadDoc } from "@/lib/filesystem/docs/load";

// 404 paths not found at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ doc: slug }));
}

export async function generateMetadata(
  props: PageProps<"/[...doc]">,
): Promise<Metadata> {
  const { doc } = await props.params;
  const { title, description } = getDoc(doc)?.frontmatter ?? {};

  return { title, description };
}

export default async function Page(props: PageProps<"/[...doc]">) {
  const { doc } = await props.params;

  const entry = getDoc(doc);
  if (!entry) notFound();

  const { default: Doc } = await loadDoc(entry);

  return (
    <>
      <Doc />
    </>
  );
}
