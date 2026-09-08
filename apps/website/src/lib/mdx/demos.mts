/**
 * Utilities shared by the two parts of the component demo pipeline:
 *
 * 1. `generate-demos.ts` extracts every `tsx demo` code block in `docs/**`
 *     into a real module under `src/generated-demos/`
 * 2. `remark-tsx-demos.mts` imports those modules back into the document,
 *    so each demo renders right above the code block it was written
 *
 * Both parts have to agree on *which* code blocks are demos and on *where* a
 * demo's module ends up, so that mapping lives here
 *
 * NOTE: This module is loaded by node's type stripping (see `next.config.ts`),
 * so it must stay erasable syntax only, and importers must use its `.mts` extension
 */

import type { Code, Nodes } from "mdast";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DOCS_ROOT = path.resolve(__dirname, "../../../../../docs");

export const DEMOS_ROOT = path.resolve(__dirname, "../../generated-demos");

export const isDemoCodeBlock = (node: Nodes): node is Code =>
  node.type === "code" && node.lang === "tsx" && node.meta === "demo";

/**
 * The module the nth demo of a document is generated into.
 * Returns `null` for anything that is not an `.mdx` file inside `docs/`
 */
export const getDemoModulePath = (
  docPath: string | undefined,
  index: number,
): string | null => {
  if (!docPath || !docPath.endsWith(".mdx")) return null;

  const relativePath = path.relative(DOCS_ROOT, docPath);

  // outside `docs/`
  if (!relativePath || relativePath.startsWith("..")) return null;
  if (path.isAbsolute(relativePath)) return null;

  return path.join(DEMOS_ROOT, `${relativePath.slice(0, -4)}-${index}.tsx`);
};

/**
 * The document a generated demo module was extracted from.
 * Returns `null` for anything that is not a generated demo module inside
 * `generated-demos/`
 *
 * The inverse of `getDemoModulePath`, so that a module found on disk can be
 * traced back to the document that owns it
 */
export const getDemoDocPath = (modulePath: string): string | null => {
  const relativePath = path.relative(DEMOS_ROOT, modulePath);

  // outside `generated-demos/`
  if (!relativePath || relativePath.startsWith("..")) return null;
  if (path.isAbsolute(relativePath)) return null;

  // strip the `-<index>.tsx` suffix `getDemoModulePath` appends
  const docName = /^(.+)-\d+\.tsx$/.exec(relativePath)?.[1];
  if (!docName) return null;

  return path.join(DOCS_ROOT, `${docName}.mdx`);
};
