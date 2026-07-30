import type { ComponentType } from "react";

import type { DocEntry, Frontmatter } from "@/lib/filesystem/docs";

interface DocModule {
  default: ComponentType;
  frontmatter?: Frontmatter;
}

/**
 * compiles and loads a single document from the monorepo root `docs/` folder
 *
 * @see [`getDoc`](apps/docs/src/lib/filesystem/docs/index.ts) - for getting the `slug` and `ext`
 *
 * @param slug the document's slug, eg. `["components", "accordion"]`
 * @param ext the document's extension, eg. `mdx`
 */
export const loadDoc = async ({ slug, ext }: DocEntry): Promise<DocModule> =>
  (await import(`@docs/${slug.join("/")}.${ext}`)) as DocModule;
