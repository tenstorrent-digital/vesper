import { CHANGELOG_PATH } from "@/lib/changelog.mts";

import type { DocEntry, DocModule } from "./types";

/**
 * compiles and loads a single document from the monorepo root `docs/` folder
 * (or one of the docs rendered from outside of it, eg. the changelog)
 *
 * @see [`getDoc`](apps/website/src/lib/filesystem/docs/index.ts) - for getting the `slug` and `ext`
 *
 * @param path the document's absolute path on disk
 * @param slug the document's slug, eg. `["components", "accordion"]`
 * @param ext the document's extension, eg. `mdx`
 */
export const loadDoc = async ({
  path,
  slug,
  ext,
}: DocEntry): Promise<DocModule> =>
  // dynamic imports with template paths are untyped (`any`), so the compiled
  // mdx module has to be cast to its (known) shape
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  (await (path === CHANGELOG_PATH
    ? import("@packages/vesper/CHANGELOG.md")
    : import(`@docs/${slug.join("/")}.${ext}`))) as DocModule;
