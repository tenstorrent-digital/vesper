import { parse } from "yaml";

import type { Frontmatter } from "./types";

/**
 * regex for frontmatter
 */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * read frontmatter straight off disk rather than from the compiled MDX module
 * (keeps out of the module graph)
 */
export const readFrontmatter = (markdown: string): Frontmatter => {
  const match = FRONTMATTER.exec(markdown);
  if (!match?.[1]) return {};

  const parsed: unknown = parse(match[1]);
  return typeof parsed === "object" && parsed !== null
    ? (parsed as Frontmatter)
    : {};
};
