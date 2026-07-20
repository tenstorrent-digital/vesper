import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  pageExtensions: [
    "ts",
    "tsx",
    // allow creating pages with markdown
    "md",
    "mdx",
  ],

  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  // handle both .md and .mdx files
  extension: /\.(md|mdx)$/,

  options: {
    remarkPlugins: [remarkGfm],
  },
});

export default withMDX(nextConfig);
