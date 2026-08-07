import * as jsxRuntime from "react/jsx-runtime";
import { createHighlighterCoreSync } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { CodeToTokenTransformStream } from "@shikijs/stream";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";

import type { CodeBlockProps } from "./code-block";
import { dark, light } from "./themes";

export const getLangName = (lang: CodeBlockProps["lang"]) =>
  typeof lang === "string" ? lang : lang?.[0]?.name || "text";

const highlighter = createHighlighterCoreSync({
  langs: [],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
  themes: [light, dark],
});

export function handleLanguageRegistration(lang: CodeBlockProps["lang"]) {
  if (!lang || typeof lang === "string") return;

  const langName = getLangName(lang);
  if (langName && !highlighter.getLoadedLanguages().includes(langName)) {
    highlighter.loadLanguageSync(lang);
  }
}

export function codeToJsx(code: string, lang: CodeBlockProps["lang"]) {
  return toJsxRuntime(
    highlighter.codeToHast(code, {
      lang: getLangName(lang),
      themes: {
        light,
        dark,
      },
      tabindex: false,
    }),
    jsxRuntime,
  );
}

export function codeToTokenStream(lang: CodeBlockProps["lang"]) {
  return new CodeToTokenTransformStream({
    highlighter,
    lang: getLangName(lang),
    themes: {
      light,
      dark,
    },
    allowRecalls: true,
  });
}
