import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import slugify from "slugify";
import { unified } from "unified";

import type { DocExtension } from "../filesystem/docs/types";

export const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter);

export const mdxParser = markdownParser().use(remarkMdx);

export const getMarkdownParser = (filetype: DocExtension) =>
  filetype === "md" ? markdownParser : mdxParser;

export const getHeadingId = (text: string) =>
  slugify(text, { lower: true, strict: true });
