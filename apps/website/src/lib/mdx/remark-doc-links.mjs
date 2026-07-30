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

/** only rewrite relative links that point at a document */
const isRelativeDoc = (url) =>
  /^\.{1,2}\//.test(url) && /\.mdx?($|[#?])/.test(url);

/**
 * rewrites relative links between documents in the monorepo root `docs/` folder
 *
 * - `./theming.mdx` -> `/theming`
 * - `../components/button.mdx#props` -> `/components/button#props`
 */
const resolveDocUrl = (url, documentSlug) => {
  const [path, hash = ""] = url.split(/(?=[#?])/, 2);

  const segments = documentSlug.slice(0, -1); // the document's own folder
  path.split("/").forEach((segment) => {
    if (segment === "." || segment === "") return; // skip current/parent folder segments
    if (segment === "..") {
      // go up a level for parent folder segments
      segments.pop();
    } else segments.push(segment.replace(/\.mdx?$/, ""));
  });

  return `/${segments.join("/")}${hash}`;
};

/**
 * visits all links in the MD/MDX and rewrites relative doc links
 */
const visitLinks = (node, visit) => {
  if (node.type === "link") visit(node);
  (node.children ?? []).forEach((child) => visitLinks(child, visit));
};

export default function remarkDocLinks() {
  return (tree, file) => {
    // `docs/components/accordion.mdx` -> ["components", "accordion"]
    const documentSlug = (file.path ?? "")
      .split(/[\\/]/)
      .slice(-2)
      .join("/")
      .replace(/\.mdx?$/, "")
      .split("/");

    visitLinks(tree, (node) => {
      if (isRelativeDoc(node.url)) {
        node.url = resolveDocUrl(node.url, documentSlug);
      }
    });
  };
}
