import { BASE_URL, VESPER_SUMMARY } from "@/lib/constants";
import { getDocTree } from "@/lib/filesystem/docs";
import type { DocEntry } from "@/lib/filesystem/docs/types";
import { isRelativeDoc, resolveDocUrl } from "@/lib/mdx/remark-doc-links.mts";

export const dynamic = "force-static";

/**
 * matches an inline Markdown link's URL, eg. the `./button.mdx` in
 * `[Button](./button.mdx)`
 */
const INLINE_LINK = /\]\(([^\s]+?)(?:\s+"([^"]*)")?\)/g;

/**
 * the canonical `.md` URL for a resolved doc route
 * eg. `/components/button#props` -> `https://.../components/button.md`
 */
const getMarkdownUrl = (route: string) => {
  const splitAt = route.search(/[#?]/);
  const [path, suffix] =
    splitAt === -1
      ? [route, ""]
      : [route.slice(0, splitAt), route.slice(splitAt)];

  return `${BASE_URL}${path}.md${suffix}`;
};

/**
 * rewrites a doc's relative links to absolute URLs
 *
 * @see [`remarkDocLinks`](apps/website/src/lib/mdx/remark-doc-links.mts) - the
 * render-time equivalent, whose resolution logic this reuses
 */
const normalizeLinks = (markdown: string, slug: DocEntry["slug"]) =>
  markdown.replace(INLINE_LINK, (match, url: string, title = "") => {
    if (!isRelativeDoc(url)) return match;

    const route = resolveDocUrl(url, slug);
    if (!route) return match;

    const titlePart = title ? ` "${title}"` : "";
    return `](${getMarkdownUrl(route)}${titlePart})`;
  });

/**
 * serves `/llms-full.txt`, the entire documentation inlined in one file
 *
 * @see [`/llms.txt`](apps/website/src/app/llms.txt/route.ts)
 * @see https://llmstxt.org
 */
export function GET() {
  const intro = [
    `# Vesper`,
    "",
    `> ${VESPER_SUMMARY}`,
    "",
    `The full text of every Vesper documentation page. For an index of links instead, see ${BASE_URL}/llms.txt`,
  ].join("\n");

  const sections = getDocTree()
    .flatMap(({ docs }) => docs)
    .map(({ markdown, slug, href }) =>
      [
        "---",
        "",
        `Source: ${BASE_URL}${href}.md`,
        "",
        normalizeLinks(markdown, slug).trimEnd(),
        "",
      ].join("\n"),
    );

  const body = [intro, "", ...sections, ""].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
