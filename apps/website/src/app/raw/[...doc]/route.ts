import { notFound } from "next/navigation";

import { importPathFor } from "@/lib/agents";
import { BASE_URL, GITHUB_URL } from "@/lib/constants";
import { docs, getDoc } from "@/lib/filesystem/docs";
import { readDocBody } from "@/lib/filesystem/docs/source";

/**
 * raw markdown for any document
 *
 * reached as `/<path>.md` — `src/proxy.ts` rewrites that onto this route, so
 * `/components/button.md` serves the source of `docs/components/button.mdx`
 *
 * a short provenance header is prepended so a document dropped into a context
 * window still knows where it came from and how to import what it describes
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map(({ slug }) => ({ doc: slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ doc: string[] }> },
) {
  const { doc } = await params;

  const entry = getDoc(doc);
  if (!entry) notFound();

  const importPath = importPathFor(entry.slug);

  const body = [
    `<!--`,
    `  ${entry.frontmatter.title ?? entry.slug.at(-1)} — Vesper`,
    `  source:  docs/${entry.slug.join("/")}.${entry.ext}`,
    `  html:    ${BASE_URL}${entry.href}`,
    ...(importPath ? [`  import:  ${importPath}`] : []),
    `  repo:    ${GITHUB_URL}`,
    `-->`,
    ``,
    readDocBody(entry).trim(),
    ``,
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-vesper-agents": "/agents",
    },
  });
}
