/**
 * the contract shared by the two halves of the component demo pipeline:
 *
 * 1. `apps/website/scripts/generate-demos.ts` extracts every ` ```tsx demo `
 *    code block in `docs/**` into a real module under `src/generated-demos/`
 * 2. `src/lib/mdx/remark-tsx-demos.mts` imports those modules back into the
 *    document, so each demo renders right above the code block it was written
 *    as
 *
 * both halves have to agree on *which* code blocks are demos and on *where* a
 * demo's module ends up, so that mapping lives here instead of being written
 * out (and drifting) in each script
 *
 * NOTE: this module is loaded by node's type stripping (see `next.config.ts`),
 * so it must stay erasable syntax only, and importers must use its real
 * `.mts` extension
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * monorepo root `docs/` folder
 *
 * resolved from this file (`apps/website/src/lib/mdx/`) rather than `cwd` so
 * both halves agree no matter where they are run from
 */
export const DOCS_ROOT = path.resolve(here, "../../../../..", "docs");

/**
 * folder demo modules are generated into
 *
 * gitignored - it is derived from `docs/` and rebuilt by `generate:demos`
 */
export const DEMOS_ROOT = path.resolve(here, "../../generated-demos");

/** language a fenced code block needs for its source to become a demo */
const DEMO_LANG = "tsx";

/** meta a fenced code block needs for its source to become a demo */
const DEMO_META = "demo";

/**
 * a fenced code block is a demo when it is written as ` ```tsx demo `
 *
 * meta is matched word by word, so a demo can still carry other meta
 * (eg. ` ```tsx demo title="toggle.tsx" `) later on
 */
export const isDemoCodeBlock = (
  lang: string | null | undefined,
  meta: string | null | undefined
): boolean =>
  lang === DEMO_LANG && !!meta && meta.trim().split(/\s+/).includes(DEMO_META);

/**
 * the module the nth demo of a document is generated into
 *
 * `docs/components/toggle.mdx` (its 2nd demo) ->
 * `apps/website/src/generated-demos/components/toggle-1.tsx`
 *
 * demos are numbered in document order, which is the order both halves walk
 * the document in
 *
 * returns `null` for anything that is not an `.mdx` file inside `docs/` -
 * those have no demos to generate or render
 *
 * (`VFile["path"]` (the virtual file used under the hood by `remark` and
 * `rehype`) is typed as a `string`, but is `undefined` for a file compiled
 * from a value rather than read from disk)
 */
export const demoModulePath = (
  docPath: string | undefined,
  index: number
): string | null => {
  if (!docPath || !docPath.endsWith(".mdx")) return null;

  const relativePath = path.relative(DOCS_ROOT, docPath);

  // outside `docs/`
  if (!relativePath || relativePath.startsWith("..")) return null;
  if (path.isAbsolute(relativePath)) return null;

  return path.join(DEMOS_ROOT, `${relativePath.slice(0, -4)}-${index}.tsx`);
};
