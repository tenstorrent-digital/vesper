import type { DocEntry, DocModule } from "./types";

/**
 * compiles and loads one document from the monorepo root `docs/` folder
 *
 * @see [`getDoc`](apps/website/src/lib/filesystem/docs/index.ts) - for getting the `slug` and `ext`
 *
 * @param slug the document's slug, eg. `["components", "accordion"]`
 * @param ext the document's extension, eg. `mdx`
 */
export const loadDoc = async ({ slug, ext }: DocEntry): Promise<DocModule> =>
  // dynamic imports with template paths are untyped (`any`), so the compiled
  // mdx module has to be cast to its (known) shape
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  (await import(`@docs/${slug.join("/")}.${ext}`)) as DocModule;
