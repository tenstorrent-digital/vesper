/**
 * Writes a module for every `tsx demo` code block in `docs/**`
 *
 * `src/lib/mdx/remark-tsx-demos.mts` imports these modules back into the
 * document they came from while next compiles it, so they have to be on disk
 * *before* next starts:
 *
 * next resolves an import against the filesystem as it saw it when the build
 * began, so a module written while a document is being compiled is not
 * guaranteed to be found. Locally it usually is (which is why a build passes
 * here), on vercel it is not - every document whose demos did not already
 * exist fails the build with `Module not found`
 *
 * Run by turbo before `build`, `dev` and `check-types` (see `turbo.jsonc`)
 */

import type { Root } from "mdast";
import { readdir, readFile, rm, rmdir } from "node:fs/promises";
import path from "node:path";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import {
  createOrUpdateFile,
  DEMOS_ROOT,
  DOC_FILE_EXT,
  DOCS_ROOT,
  getDemoCodeBlocks,
  getDemoModulePath,
  getDemoModuleSource,
} from "../src/lib/mdx/tsx-demos.mts";

/**
 * mirrors the markdown half of the pipeline `next.config.ts` configures, so a
 * demo lands at the same index here as it does when the document is compiled
 */
const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter);

const mdxParser = markdownParser().use(remarkMdx);

/** Every `.md`/`.mdx` document in the monorepo's `docs/` folder */
const getDocPaths = async (): Promise<string[]> => {
  const entries = await readdir(DOCS_ROOT, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && DOC_FILE_EXT.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
};

/** Every file currently under `generated/demos` */
const getDemoModulePaths = async (): Promise<string[]> => {
  const entries = await readdir(DEMOS_ROOT, {
    recursive: true,
    withFileTypes: true,
  }).catch(() => []);

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
};

/** Writes a document's demos, returning the modules it was written into */
const writeDemoModules = async (docPath: string): Promise<string[]> => {
  const contents = await readFile(docPath, "utf-8");
  const parser = docPath.endsWith(".mdx") ? mdxParser : markdownParser;
  const tree = parser.parse(contents) as Root;

  const demoModulePaths: string[] = [];

  for (const [index, demo] of getDemoCodeBlocks(tree).entries()) {
    const demoModulePath = getDemoModulePath(docPath, index);
    if (!demoModulePath) continue;

    await createOrUpdateFile(demoModulePath, getDemoModuleSource(demo));
    demoModulePaths.push(demoModulePath);
  }

  return demoModulePaths;
};

/**
 * Deletes the demos of code blocks that are gone
 *
 * Without this, a stale module would keep being compiled, type checked and
 * cached as part of a build that no document imports it into
 */
const removeStaleDemoModules = async (
  demoModulePaths: string[],
): Promise<number> => {
  const current = new Set(demoModulePaths);
  const stale = (await getDemoModulePaths()).filter(
    (demoModulePath) => !current.has(demoModulePath),
  );

  await Promise.all(stale.map((demoModulePath) => rm(demoModulePath)));

  // clean up the folders the removed demos leave behind, deepest first
  const directories = [
    ...new Set(stale.map((demoModulePath) => path.dirname(demoModulePath))),
  ].sort((a, b) => b.length - a.length);

  for (const directory of directories) {
    // fails (and is skipped) while the folder still holds demos
    await rmdir(directory).catch(() => null);
  }

  return stale.length;
};

const docPaths = await getDocPaths();

const demoModulePaths = (
  await Promise.all(docPaths.map(writeDemoModules))
).flat();

const staleCount = await removeStaleDemoModules(demoModulePaths);

console.log(
  `Generated ${demoModulePaths.length} demos from ${docPaths.length} documents` +
    (staleCount ? ` (removed ${staleCount} stale)` : ""),
);
