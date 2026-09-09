/**
 * Shared plumbing for the component demos written from `docs/**`
 *
 * Used by both halves of the demo pipeline:
 *
 * (1) `scripts/generate-demos.mts` writes every demo module to disk *before* next compiles anything
 * (2) `src/lib/mdx/remark-tsx-demos.mts` imports those modules back into the document they came from
 *
 * Both are loaded by node's type stripping, so this file must stay erasable
 * syntax only (no `enum`, `namespace`, etc.)
 *
 * @see https://nodejs.org/api/typescript.html#type-stripping
 */

import type { Code, Nodes, Root } from "mdast";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DOC_FILE_EXT = /\.(md|mdx)$/;

export const DOCS_ROOT = path.resolve(__dirname, "../../../../../docs");

/**
 * Where the demos extracted from `docs/**` are written
 *
 * They are generated build artifacts, so they are kept out of `src/`, but they
 * stay inside the app so next can compile them as part of this project
 */
export const DEMOS_ROOT = path.resolve(__dirname, "../../../generated/demos");

/**
 * Detects whether a given mdast node is a fenced code block we want to turn into a demo, ie:
 *
 * ````
 * ```tsx demo
 * export default function HelloWorld() {
 *   return <p>hello world!</p>
 * }
 * ```
 * ````
 */
export const isDemoCodeBlock = (node: Nodes): node is Code =>
  node.type === "code" && node.lang === "tsx" && node.meta === "demo";

/**
 * The demos of a document, in the order they appear in it
 *
 * Only top level code blocks are demos: a demo is rendered in place of the
 * block it was written as, which is something we only do for the document
 * itself (and not for, say, a code block nested in a list item)
 */
export const getDemoCodeBlocks = (tree: Root): Code[] =>
  tree.children.filter(isDemoCodeBlock);

/**
 * The module the nth demo of a document is generated into.
 * Returns `null` for anything that is not an `.mdx` file inside `docs/`
 */
export const getDemoModulePath = (
  docPath: string | undefined,
  index: number,
): string | null => {
  if (!docPath || !DOC_FILE_EXT.test(docPath)) return null;

  const relativePath = path.relative(DOCS_ROOT, docPath);

  // outside `docs/`
  if (!relativePath || relativePath.startsWith("..")) return null;
  if (path.isAbsolute(relativePath)) return null;

  return path.join(DEMOS_ROOT, `${relativePath}.${index}.tsx`);
};

/**
 * The source a demo is written to disk as
 *
 * Demos are interactive, so they are always client components - the documents
 * that render them are not
 */
export const getDemoModuleSource = (demo: Code): string =>
  `"use client"\n\n${demo.value.trim()}`;

/**
 * Write to a file, skipping the write when it is already up to date
 *
 * Generated demos live inside the app, so rewriting one that did not
 * change would restart next's dev server for nothing (and bust turbo's cache)
 */
export const createOrUpdateFile = async (filePath: string, content: string) => {
  const current = await readFile(filePath, "utf-8").catch(() => null);
  if (current === content) return;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
};
