/**
 * markdown -> plain, searchable prose
 *
 * the search index stores what a *reader* sees, not what the author typed, so
 * a query like "auto-dismiss" matches text that is written as
 * `auto-dismiss`, **auto-dismiss**, or [auto-dismiss](/x) in the source
 */

/**
 * removes fenced code blocks
 *
 * code is deliberately *not* indexed: it is the bulk of the corpus by weight,
 * and almost everything a person searches for in it (prop names, types,
 * defaults) also appears in the prop tables, which are markdown and are kept
 *
 * handles ``` and ~~~ of any length, matching the fence rules in
 * `src/lib/filesystem/docs/source.ts`
 */
const stripFences = (markdown: string): string => {
  const kept: string[] = [];

  let fence: string | undefined;

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^\s*(```+|~~~+)/.exec(line);

    if (match?.[1]) {
      if (!fence) fence = match[1];
      else if (match[1][0] === fence[0] && match[1].length >= fence.length) {
        fence = undefined;
      }
      continue;
    }

    if (!fence) kept.push(line);
  }

  return kept.join("\n");
};

/**
 * flattens a chunk of markdown (or MDX) down to the words in it
 *
 * @param {string} markdown - the source to flatten
 *
 * @example
 * toPlainText("A **bold** [link](/x) and `code`.");
 * // "A bold link and code."
 */
export const toPlainText = (markdown: string): string =>
  stripFences(markdown)
    // mdx module syntax
    .replace(/^\s*(?:import|export)\s.+$/gm, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    // ![alt](src) -> alt, [label](href) -> label
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    // jsx and html: drop the tag, keep the text it wraps
    .replace(/<[^>]*>/g, " ")
    // table cells and the `| --- |` rules between them
    .replace(/^\s*\|?[\s:|-]*\|[\s:|-]*$/gm, " ")
    .replace(/\\\|/g, " ")
    .replace(/\|/g, " ")
    // list bullets, blockquote markers, and leftover emphasis
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*>+\s?/gm, " ")
    .replace(/[`*_~]/g, "")
    .replace(/\\([^\s\\])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
