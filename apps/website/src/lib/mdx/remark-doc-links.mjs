/**
 * remark plugin to rewrite relative links before we render them
 *
 * this way links resolve both:
 * - on github (where it points at the real file)
 * - on the website (where this plugin rewrites it to the document's route)
 *
 * for example:
 * - [Icon Button](./icon-button.mdx) -> /components/icon-button
 * - [Getting Started](../getting-started.mdx#installation) -> /getting-started#installation
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * monorepo root `docs/` folder
 *
 * resolved from this file (`apps/website/src/lib/mdx/`) rather than `cwd` so
 * the plugin works no matter where the build is run from
 */
const DOCS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../..",
  "docs",
);

/**
 * get a document's own path segments, relative to `docs/`
 *
 * - `docs/getting-started.mdx` -> ["getting-started"]
 * - `docs/components/accordion.mdx` -> ["components", "accordion"]
 * - `docs/guides/react/forms.mdx` -> ["guides", "react", "forms"]
 *
 * returns `null` for files outside `docs/` (eg. `src/app/page.mdx`), which
 * have no doc route to resolve relative links against
 */
const documentSlug = (filePath) => {
  if (!filePath) return null;

  const relativePath = path.relative(DOCS_DIR, filePath);
  if (!relativePath || relativePath.startsWith("..")) return null;

  return relativePath.replace(/\.mdx?$/, "").split(/[\\/]/);
};

/** only rewrite relative links that point at a document */
const isRelativeDoc = (url) =>
  /^\.{1,2}\//.test(url) && /\.mdx?($|[#?])/.test(url);

/**
 * rewrite a doc's relative links between documents in the monorepo root `docs/` folder
 *
 * - `./theming.mdx` -> `/theming`
 * - `../components/button.mdx#props` -> `/components/button#props`
 */
const resolveDocUrl = (url, slug) => {
  // split the url into path and hash/query (if any)
  const splitAt = url.search(/[#?]/);
  // url path is before the splitAt
  const [urlPath, hash] =
    splitAt === -1 ? [url, ""] : [url.slice(0, splitAt), url.slice(splitAt)];

  const segments = slug.slice(0, -1); // the document's own folder
  urlPath.split("/").forEach((segment) => {
    if (segment === "." || segment === "") return; // skip current/parent folder segments
    if (segment === "..") {
      // go up a level for parent folder segments
      segments.pop();
    } else segments.push(segment.replace(/\.mdx?$/, ""));
  });

  // then we can return the resolved path and add the hash/queries back
  return `/${segments.join("/")}${hash}`;
};

/**
 * visit all links in the MD/MDX and rewrites relative doc links
 */
const visitLinks = (node, visit) => {
  if (node.type === "link") visit(node);
  (node.children ?? []).forEach((child) => visitLinks(child, visit));
};

export default function remarkDocLinks() {
  return (tree, file) => {
    const slug = documentSlug(file.path);

    // leave links in documents outside `docs/` alone
    if (!slug) return;

    visitLinks(tree, (node) => {
      if (isRelativeDoc(node.url)) {
        node.url = resolveDocUrl(node.url, slug);
      }
    });
  };
}
