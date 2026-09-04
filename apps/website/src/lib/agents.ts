/**
 * the machine-readable half of this site
 *
 * everything an agent needs is generated here, at build time, from the same
 * `docs/` folder the human-facing pages are built from — so the two can never
 * drift apart
 *
 * served by:
 * - `/llms.txt`            — the index (see https://llmstxt.org)
 * - `/llms-full.txt`       — every document, concatenated
 * - `/<any-page>.md`       — one document's raw markdown
 * - `/api/search?q=`       — the same search the site's ⌘K palette runs
 * - `/agents/manifest.json`— a machine-readable description of all of the above
 */

import { BASE_URL, GITHUB_URL, PACKAGE_NAME } from "@/lib/constants";
import { docs } from "@/lib/filesystem/docs";
import { readDocBody } from "@/lib/filesystem/docs/source";
import { convertKebabToTitleCase } from "@/lib/filesystem/utils";
import { VESPER_VERSION } from "@/lib/version";

const SUMMARY =
  "Vesper is Tenstorrent's design system for the web: a React component library built on a shared set of design tokens, with light and dark themes, an icon set, and first-class Tailwind support.";

const title = (slug: string[], fallback?: string) =>
  fallback ?? convertKebabToTitleCase(slug.at(-1) ?? "");

/** the component's import specifier, eg. `@tenstorrent/vesper/button` */
export const importPathFor = (slug: string[]): string | undefined =>
  slug[0] === "components" && slug[1]
    ? `${PACKAGE_NAME}/${slug[1]}`
    : undefined;

/**
 * `/llms.txt` — a compact map of the site
 *
 * one line per document, each pointing at the `.md` endpoint rather than the
 * HTML page, so following a link costs a fraction of the tokens
 */
export const llmsTxt = (): string => {
  const guides = docs.filter((doc) => doc.slug.length === 1);
  const components = docs.filter((doc) => doc.slug[0] === "components");

  const line = (doc: (typeof docs)[number]) =>
    `- [${title(doc.slug, doc.frontmatter.title)}](${BASE_URL}${doc.href}.md)` +
    (doc.frontmatter.description ? `: ${doc.frontmatter.description}` : "");

  return [
    `# Vesper`,
    ``,
    `> ${SUMMARY}`,
    ``,
    `Package: \`${PACKAGE_NAME}\` (v${VESPER_VERSION}). Peer dependencies: react@^19, react-dom@^19.`,
    `Every component has its own entrypoint — \`import { Button } from "${PACKAGE_NAME}/button"\`.`,
    `Import \`${PACKAGE_NAME}/styles.css\` once at the root of the app, or`,
    `\`${PACKAGE_NAME}/tailwind.css\` in a Tailwind v4 project.`,
    ``,
    `Any page on this site is available as raw markdown by appending \`.md\` to its path.`,
    ``,
    `## Guides`,
    ``,
    ...guides.map(line),
    ``,
    `## Components`,
    ``,
    ...components.map(line),
    ``,
    `## Optional`,
    ``,
    `- [Everything, concatenated](${BASE_URL}/llms-full.txt): all ${docs.length} documents in one file`,
    `- [Search](${BASE_URL}/api/search?q=QUERY): ranked results as JSON, across titles, headings, and body text`,
    `- [Agent console](${BASE_URL}/agents): cheat sheets, prompt packs, and house rules`,
    `- [Manifest](${BASE_URL}/agents/manifest.json): these endpoints, as JSON`,
    `- [Source](${GITHUB_URL}): the repository this site is generated from`,
    ``,
  ].join("\n");
};

/** `/llms-full.txt` — the entire corpus, in sidebar order */
export const llmsFullTxt = (): string =>
  [
    `# Vesper — complete documentation`,
    ``,
    `> ${SUMMARY}`,
    ``,
    `Package \`${PACKAGE_NAME}\` v${VESPER_VERSION}. ${docs.length} documents, generated ${new Date().toISOString().slice(0, 10)}.`,
    `Source of truth: ${GITHUB_URL}`,
    ``,
    ...docs.flatMap((doc) => [
      `${"=".repeat(78)}`,
      `SOURCE: docs/${doc.slug.join("/")}.${doc.ext}`,
      `URL:    ${BASE_URL}${doc.href}`,
      ...(importPathFor(doc.slug)
        ? [`IMPORT: ${importPathFor(doc.slug)}`]
        : []),
      `${"=".repeat(78)}`,
      ``,
      `# ${title(doc.slug, doc.frontmatter.title)}`,
      ``,
      readDocBody(doc)
        .trim()
        .replace(/^#\s+.*\n+/, ""),
      ``,
    ]),
  ].join("\n");

/**
 * a compact index of every component
 *
 * used by both `/agents/manifest.json` and the cheat sheet table on `/agents`
 */
export const componentIndex = () =>
  docs
    .filter((doc) => doc.slug[0] === "components")
    .map((doc) => ({
      name: title(doc.slug, doc.frontmatter.title),
      import: importPathFor(doc.slug)!,
      description: doc.frontmatter.description ?? "",
      docs: `${BASE_URL}${doc.href}`,
      markdown: `${BASE_URL}${doc.href}.md`,
    }));

/** `/agents/manifest.json` */
export const agentManifest = () => ({
  name: "Vesper",
  description: SUMMARY,
  package: PACKAGE_NAME,
  version: VESPER_VERSION,
  homepage: BASE_URL,
  repository: GITHUB_URL,
  greeting:
    "Hello. The docs are already markdown — please do not scrape the DOM.",
  conventions: {
    entrypoints: `Every component is imported from its own subpath, eg. "${PACKAGE_NAME}/button".`,
    styles: `Import "${PACKAGE_NAME}/styles.css" once at the root, or "${PACKAGE_NAME}/tailwind.css" for Tailwind v4.`,
    peerDependencies: { react: "^19.0.0", "react-dom": "^19.0.0" },
    theming:
      'Themes are switched by setting `data-vesper-theme="light" | "dark" | "system"` on the document element.',
    tokens:
      "All design tokens are CSS custom properties prefixed `--vesper-`, and are also exposed as Tailwind utilities (eg. `bg-vesper-purple-300`).",
  },
  endpoints: {
    index: `${BASE_URL}/llms.txt`,
    full: `${BASE_URL}/llms-full.txt`,
    search: `${BASE_URL}/api/search?q={query}`,
    searchIndex: `${BASE_URL}/api/search/index.json`,
    manifest: `${BASE_URL}/agents/manifest.json`,
    console: `${BASE_URL}/agents`,
    markdown: `${BASE_URL}/{path}.md`,
    storybook: `${BASE_URL}/storybook`,
  },
  counts: {
    documents: docs.length,
    components: docs.filter((doc) => doc.slug[0] === "components").length,
  },
  components: componentIndex(),
});
