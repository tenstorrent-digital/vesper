/**
 * renders every `.md`/`.mdx` file in the monorepo root `docs/` folder
 *
 * (page routes declared explicitly in `src/app` (eg. `/components`) will
 * take precedence over this catch-all route)
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocFooter } from "@/components/doc/doc-footer";
import { DocHeader } from "@/components/doc/doc-header";
import { Toc } from "@/components/doc/toc";

import { docs, getDoc } from "@/lib/filesystem/docs";
import { loadDoc } from "@/lib/filesystem/docs/load";
import { readDocBody, readDocHeadings } from "@/lib/filesystem/docs/source";
import { getNavNeighbours, getNavPage, navSections } from "@/lib/nav";

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

/** ~230 words a minute, rounded up, never zero */
const readingTime = (body: string) =>
  Math.max(1, Math.round(body.split(/\s+/).length / 230));

export default async function Page(props: PageProps<"/[...doc]">) {
  const { doc } = await props.params;

  const entry = getDoc(doc);
  if (!entry) notFound();

  const { default: Doc } = await loadDoc(entry);

  const page = getNavPage(entry.href);
  const { previous, next } = getNavNeighbours(entry.href);

  const section =
    navSections.find((group) =>
      group.pages.some(({ href }) => href === entry.href),
    )?.label ?? "Docs";

  /**
   * only `##` and `###` make the table of contents: `#` is the page title
   * (rendered in the header, and stripped from the body by
   * `remark-doc-lede.mts`), and anything deeper is detail
   */
  const headings = readDocHeadings(entry).filter(
    ({ depth }) => depth === 2 || depth === 3,
  );

  /**
   * `tokens` is one very wide table after another, so it gets the full width
   * of the content column rather than the measure used for running text
   */
  const wide = entry.slug[0] === "tokens";

  return (
    <div className="doc" data-width={wide ? "wide" : undefined}>
      <article className="doc-article">
        <DocHeader
          section={section}
          title={page?.title ?? entry.slug.at(-1) ?? "Untitled"}
          description={entry.frontmatter.description}
          href={entry.href}
          sourcePath={`docs/${entry.slug.join("/")}.${entry.ext}`}
          readingTime={readingTime(readDocBody(entry))}
        />

        <div className="prose">
          <Doc />
        </div>

        <DocFooter previous={previous} next={next} />
      </article>

      <aside className="doc-aside">
        <Toc headings={headings} />
      </aside>
    </div>
  );
}
