/**
 * the changelog of `@tenstorrent/vesper`, which is written by changesets into
 * `packages/vesper/CHANGELOG.md` and rendered on the site at `/changelog`
 *
 * the file is never edited by hand, so anything that only makes sense on the
 * site (commit links, etc.) is applied by `src/lib/mdx/remark-changelog.mts`
 * instead of in the file itself
 *
 * this is loaded by node's type stripping (from the remark plugin), so it must
 * stay erasable syntax only and import other `.mts` files by their extension
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * absolute path to the changelog
 *
 * resolved from this file (`apps/website/src/lib/`) rather than `cwd` so it
 * matches the path remark sees no matter where the build is run from
 */
export const CHANGELOG_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
  "packages/vesper/CHANGELOG.md",
);

/** route the changelog is rendered at */
export const CHANGELOG_SLUG = ["changelog"];

export const CHANGELOG_DESCRIPTION =
  "Release notes for every published version of @tenstorrent/vesper";

/** commits listed in the changelog link to this repository */
export const REPOSITORY_URL = "https://github.com/tenstorrent-digital/vesper";

/**
 * whether a file (eg. a remark `VFile`'s `path`) is the changelog
 *
 * (`VFile["path"]` is `undefined` for a file compiled from a value)
 */
export const isChangelog = (filePath: string | undefined): boolean =>
  !!filePath && path.resolve(filePath) === CHANGELOG_PATH;
