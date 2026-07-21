import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
