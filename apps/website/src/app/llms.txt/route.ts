import { BASE_URL, VESPER_SUMMARY } from "@/lib/constants";
import { docsSortOrder, getDocTree, parseDoc } from "@/lib/filesystem/docs";
import type { DocEntry } from "@/lib/filesystem/docs/types";
import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

export const dynamic = "force-static";

const getDocLink = ({ frontmatter, slug, href }: DocEntry) => {
  const text = frontmatter.title ?? convertKebabToTitleCase(slug.at(-1) ?? "");
  const url = `${BASE_URL}${href}.md`;

  return `[${text}](${url})`;
};

/**
 * serves `/llms.txt`, an index of the documentation for LLMs and agents
 *
 * follows the llms.txt convention: an `H1` title, a blockquote summary, then
 * `H2` sections of annotated links
 *
 * @see https://llmstxt.org
 */
export function GET() {
  const intro = [
    `# Vesper`,
    "",
    `> ${VESPER_SUMMARY}`,
    "",
    `Each link below returns the raw Markdown source of a documentation page.`,
    `For the full text of every page in a single request, see ${BASE_URL}/llms-full.txt`,
  ].join("\n");

  const sections = getDocTree().map(({ folder, docPaths }) =>
    [
      `## ${folder ? convertKebabToTitleCase(folder) : "High-level documentation"}`,
      "",
      ...docPaths
        .map(parseDoc)
        .sort(docsSortOrder)
        .map((doc) => {
          const link = getDocLink(doc);
          if (!doc.frontmatter.description) return `- ${link}`;
          return `- ${link}: ${doc.frontmatter.description}`;
        }),
      "",
    ].join("\n"),
  );

  const body = [intro, "", ...sections].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
