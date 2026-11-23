import type { CSSProperties } from "react";

import {
  codeToTokens,
  type CodeToTokensOptions,
  isSupportedLanguage,
  LiveTokenizer,
  StreamTokenizer,
  type ThemedToken,
} from "@pierre/highlights";

import type { CodeBlockProps } from "./code-block";

import { dark, light } from "./themes";

// languages that aren't supported by `@pierre/highlights` are rendered as plain text
const getHighlightOptions = (
  lang: CodeBlockProps["lang"],
): CodeToTokensOptions => ({
  lang: lang && isSupportedLanguage(lang) ? lang : "text",
  // light theme styles are applied inline, and dark theme styles are stored
  // in `hls-dark*` custom properties, which `code-block.css` applies
  themes: { light, dark },
});

/** Split code into lines of syntax-highlighted tokens */
export const codeToLines = (code: string, lang: CodeBlockProps["lang"]) =>
  codeToTokens(code, getHighlightOptions(lang)).tokens;

/** The lines that changed after streaming in more code: every line from `start` onward */
export interface LinesUpdate {
  start: number;
  lines: ThemedToken[][];
}

/** Highlights code as it streams in, including the line that's still streaming in */
export interface LineHighlighter {
  /** Highlight another chunk of code */
  push(chunk: string): LinesUpdate;
  /** Highlight whatever's left once the stream has closed */
  end(): LinesUpdate;
  /** Free the highlighter's WebAssembly instance */
  dispose(): void;
}

/**
 * Create a highlighter for streamed code, which keeps track of syntax state
 * (eg. unclosed comments or strings, or ANSI colors) across lines
 *
 * Each highlighter creates a separate WebAssembly instance, which `dispose()` frees
 */
export function createLineHighlighter(
  lang: CodeBlockProps["lang"],
): LineHighlighter {
  const options = getHighlightOptions(lang);
  // `LiveTokenizer` renders ANSI escape sequences as plain text
  return options.lang.toLowerCase() === "ansi"
    ? createAnsiLineHighlighter(options)
    : createLiveLineHighlighter(options);
}

// highlights code by appending each chunk to the end of a `LiveTokenizer` document
function createLiveLineHighlighter(
  options: CodeToTokensOptions,
): LineHighlighter {
  const tokenizer = new LiveTokenizer(options);

  return {
    push(chunk) {
      const lastLine = tokenizer.lineCount - 1;
      const end = {
        line: lastLine,
        character: tokenizer.getLineLength(lastLine),
      };
      const { lineChanges } = tokenizer.applyEdits([
        { range: { start: end, end }, newText: chunk },
      ]);

      // appending usually only changes the last line onward, but a chunk starting
      // with `\n` can join a `\r` at the end of the previous line into `\r\n`
      const start = Math.min(
        lastLine,
        ...lineChanges.map((change) => change.newStartLine),
      );
      const lines: ThemedToken[][] = [];
      for (let line = start; line < tokenizer.lineCount; line++) {
        lines.push(tokenizer.getLineTokens(line).tokens);
      }
      return { start, lines };
    },
    // every line is already highlighted by the time the stream closes
    end: () => ({ start: tokenizer.lineCount, lines: [] }),
    dispose: () => tokenizer.dispose(),
  };
}

/**
 * Highlights ANSI output by highlighting complete lines with a `StreamTokenizer`
 *
 * The line that's still streaming in is highlighted on its own, after the SGR
 * sequences (colors and font styles) that are still active from earlier lines,
 * and is replaced by the tokenizer's output once it's complete
 */
function createAnsiLineHighlighter(
  options: CodeToTokensOptions,
): LineHighlighter {
  const tokenizer = new StreamTokenizer(options);
  let completeLineCount = 0;
  let pendingText = "";
  let activeSgrSequences = "";

  return {
    push(chunk) {
      const completeLines = tokenizer.pushCode(chunk);
      const start = completeLineCount;
      completeLineCount += completeLines.length;

      const text = pendingText + chunk;
      const lineBreak = text.lastIndexOf("\n");
      if (lineBreak >= 0) {
        activeSgrSequences = getActiveSgrSequences(
          activeSgrSequences + text.slice(0, lineBreak),
        );
      }
      pendingText = text.slice(lineBreak + 1);

      // escape sequences aren't rendered, so they only style the pending text
      const pendingLine = codeToTokens(
        activeSgrSequences + pendingText,
        options,
      ).tokens.flat();

      return { start, lines: [...completeLines, pendingLine] };
    },
    end: () => ({ start: completeLineCount, lines: tokenizer.end() }),
    dispose: () => tokenizer.dispose(),
  };
}

// ANSI SGR sequences, which set colors and font styles (eg. `ESC[1;31m`)
// matching escape sequences means matching the ESC control character
// oxlint-disable-next-line no-control-regex
const SGR_SEQUENCE = /\u001b\[([\d;:]*)m/g;

// get the SGR sequences that are still active at the end of some text
function getActiveSgrSequences(text: string) {
  let active = "";
  for (const [sequence, params = ""] of text.matchAll(SGR_SEQUENCE)) {
    // a sequence that starts with `0` (or has no params) resets all styles.
    // The sequences before it no longer apply
    if (Number(params.split(/[;:]/)[0]) === 0) active = "";
    active += sequence;
  }
  return active;
}

// tokens with identical styles share the same `htmlStyle` object, so style
// objects are cached by `htmlStyle` identity (which also hands React the same
// style object for identical tokens)
const tokenStyles = new WeakMap<Record<string, string>, CSSProperties>();

// convert a CSS property name to its React `style` prop key (eg.
// `font-style` to `fontStyle`), leaving custom properties as they are
const toStyleKey = (property: string) =>
  property.startsWith("--")
    ? property
    : property.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());

/** Get a token's styles as a React `style` object */
export function getTokenStyle({ htmlStyle }: ThemedToken) {
  if (!htmlStyle) return undefined;

  let style = tokenStyles.get(htmlStyle);
  if (!style) {
    style = Object.fromEntries(
      Object.entries(htmlStyle).map(([property, value]) => [
        toStyleKey(property),
        value,
      ]),
    );
    tokenStyles.set(htmlStyle, style);
  }
  return style;
}
