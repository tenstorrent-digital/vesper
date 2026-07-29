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
     * @see https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
     */
    remarkPlugins: [
      "remark-gfm",

      /**
       * add support for accessing frontmatter from md/mdx
       *
       * @see type definitions: apps/docs/src/types/mdx.d.ts
       * @see (extremely light) documentation: https://nextjs.org/docs/app/guides/mdx#frontmatter
       */
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
  },
});

export default withMDX(nextConfig);
