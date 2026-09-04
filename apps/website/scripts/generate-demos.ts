import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demosRoot = path.resolve(__dirname, "../src/generated-demos");
const docsRoot = path.resolve(__dirname, "../../../docs");

/**
 * Regular Expression to match code blocks in markdown files.
 *
 * Capture groups:
 *
 * | # | Name    | Example                                |
 * | - | ------- | -------------------------------------- |
 * | 1 | indent  | "  " (for fences nested in list items) |
 * | 2 | fence   | ``` / ```` / ~~~                       |
 * | 3 | lang    | tsx                                    |
 * | 4 | meta    | demo, or title="foo.ts" {1,3}          |
 * | 5 | content | everything between the fences          |
 * */
const CODE_BLOCK_REGEX =
  /^([ \t]*)(```+|~~~+)([A-Za-z0-9_+-]*)[ \t]*([^\n]*?)[ \t]*(?:\r?\n([\s\S]*?))?\r?\n\1\2[ \t]*$/gm;

try {
  const files = await readdir(docsRoot, { recursive: true });

  for (const file of files) {
    if (typeof file !== "string" || !file.endsWith(".mdx")) continue;

    const markdown = await readFile(path.resolve(docsRoot, file), "utf-8");
    let demoIndex = -1;

    for (const m of markdown.matchAll(CODE_BLOCK_REGEX)) {
      const [, indent, , lang, meta, content] = m;
      if (!content || lang !== "tsx" || meta !== "demo") continue;

      // strip the fence's indentation off each line
      const source = indent
        ? content.replace(new RegExp(`^${indent}`, "gm"), "")
        : content;

      demoIndex++;
      const demoFile = path.resolve(
        demosRoot,
        file.slice(0, -4).concat(`-${demoIndex}.tsx`)
      );

      await mkdir(path.dirname(demoFile), { recursive: true });
      await writeFile(demoFile, `${source}\n`, { encoding: "utf-8" });
    }
  }
} catch (err) {
  console.error(err);
}
