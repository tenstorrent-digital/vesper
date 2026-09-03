import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(appRoot, "..", "..");

const nextConfig: NextConfig = {
  /**
   * pin the workspace root so next's turbopack (not from the monorepo) can
   * resolve `packages/vesper` via the symlink from turbo in monorepo with
   * `node_modules/@tenstorrent/vesper`
   *
   * (without this, next infers the root from the nearest lockfile)
   */
  turbopack: {
    root: monorepoRoot,
  },

  experimental: {
    /**
     * since we import components from `@tenstorrent/vesper` with turbo, and
     * `@tenstorrent/vesper` is compiled into `dist` by a separate watcher,
     * we want to use turbo's cache in development
     *
     * without this, if the app is shut down or restarted from turbo (ctrl-c)
     * or via `concurrently --kill-others`, turbo sometimes restores an
     * older snapshot from the dev cache, leaving stale CSS and components
     * in the browser
     *
     * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache
     */
    turbopackFileSystemCacheForDev: false,
  },

  pageExtensions: [
    "ts",
    "tsx",

    // allow creating next `page.{ext}`s with markdown
    "md",
    "mdx",
  ],

  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  // handle both .md and .mdx files
  extension: /\.(md|mdx)$/,

  options: {
    /**
     * to use remark/rehype plugins with turborepo, we have to
     * specify plugin names using a string (no need for `import`)
     *
     * our own plugins are authored in typescript (`.mts`) and are loaded by
     * node's type stripping, which erases the types at import time - so they
     * must stay erasable syntax only (no `enum`, `namespace`, etc.)
     *
     * @see https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
     * @see https://nodejs.org/api/typescript.html#type-stripping
     */
    remarkPlugins: [
      "remark-gfm",

      /**
       * add support for accessing frontmatter from md/mdx
       *
       * @see type definitions: apps/website/src/types/mdx.d.ts
       * @see (extremely light) documentation: https://nextjs.org/docs/app/guides/mdx#frontmatter
       */
      "remark-frontmatter",
      "remark-mdx-frontmatter",

      /**
       * rewrites relative links between documents in `docs/**` to their routes,
       * so a link resolves both on GitHub and on the website
       *
       * must be an absolute path: `@next/mdx` resolves plugin strings with
       * `require.resolve` from inside its own loader, so a project-relative
       * path resolves against `node_modules/@next/mdx` and is not found
       */
      path.join(appRoot, "src/lib/mdx/remark-doc-links.mts"),

      /**
       * gives every heading a stable `id`, so the table of contents, the
       * command palette, and `#fragment` links all have something to point at
       */
      path.join(appRoot, "src/lib/mdx/remark-heading-ids.mts"),

      /**
       * drops the `# Title` and repeated description a document in `docs/`
       * opens with — the website renders both itself, above the document body
       */
      path.join(appRoot, "src/lib/mdx/remark-doc-lede.mts"),

      /**
       * adds support for github's alert syntax (`> [!NOTE]`, `> [!WARNING]`,
       * etc.), so a blockquote written as a callout renders as the matching
       * `Admonition` variant on the site and as a callout on GitHub
       */
      path.join(appRoot, "src/lib/mdx/remark-blockquote-alerts.mts"),

      /**
       * keeps text written inside a JSX element from being parsed as markdown
       * flow, so `<Typography>`/`<Accordion>`/`<Admonition>`/etc. render their
       * children as-is instead of wrapping them in a paragraph (which
       * `src/mdx-components.tsx` maps to another component)
       */
      [
        path.join(appRoot, "src/lib/mdx/remark-jsx-text-children.mts"),
        { ignore: [] },
      ],
    ],

    rehypePlugins: [
      /**
       * same idea as `remark-jsx-text-children.mts`, but for blockquotes:
       * markdown turns their content into one paragraph per block, so
       * `<Admonition>` (what `blockquote` maps to in `src/mdx-components.tsx`)
       * would render a `Typography` per paragraph inside the one it already
       * wraps its children in
       *
       * it runs on hast instead of mdast because the paragraphs a blockquote
       * holds are re-padded with `\n` when markdown is turned into html
       *
       * absolute path for the same reason as the plugins above
       */
      path.join(appRoot, "src/lib/mdx/rehype-blockquote-text-children.mts"),
    ],
  },
});

export default withMDX(nextConfig);
