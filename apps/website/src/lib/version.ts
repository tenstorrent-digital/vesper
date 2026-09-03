import fs from "node:fs";
import path from "node:path";

/**
 * the version of `@tenstorrent/vesper` this build of the site documents
 *
 * read off disk rather than imported: the package's `exports` map does not
 * expose `package.json`, so `import pkg from "@tenstorrent/vesper/package.json"`
 * would not resolve
 *
 * this lives apart from `src/lib/constants.ts` because it touches `node:fs` —
 * `constants.ts` is imported by client components, and a client bundle cannot
 * contain a node built-in
 */
export const VESPER_VERSION: string = (() => {
  try {
    const manifest = fs.readFileSync(
      // cwd is `apps/website`
      path.join(
        process.cwd(),
        "..",
        "..",
        "packages",
        "vesper",
        "package.json",
      ),
      "utf8",
    );

    const { version } = JSON.parse(manifest) as { version?: string };
    return version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
})();
