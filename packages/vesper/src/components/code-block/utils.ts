import type { CSSProperties } from "react";

import {
  codeToTokens,
  type CodeToTokensOptions,
  isSupportedLanguage,
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

/**
 * Create a tokenizer that highlights streamed code one line at a time, keeping
 * track of syntax state (eg. unclosed comments or strings) across lines
 *
 * Each tokenizer creates a separate WebAssembly instance, which `dispose()` (or
 * `end()`) frees once the tokenizer is no longer needed
 */
export const createLineTokenizer = (lang: CodeBlockProps["lang"]) =>
  new StreamTokenizer(getHighlightOptions(lang));

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
