import {
  createHighlighterCore,
  type HighlighterCore,
  type LanguageInput,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { theme } from "./theme";
import * as jsxRuntime from "react/jsx-runtime";

type CodeBlockStoreState =
  | { highlighter: null; initialized: false }
  | { highlighter: HighlighterCore; initialized: true };

class CodeBlockStore {
  state: CodeBlockStoreState = {
    initialized: false,
    highlighter: null,
  };

  setupCodeBlock = async ({ langs }: { langs: LanguageInput[] }) => {
    this.state = {
      initialized: true,
      highlighter: await createHighlighterCore({
        langs,
        engine: createJavaScriptRegexEngine(),
        themes: [theme],
      }),
    };
  };

  codeToJsx = ({ code, lang }: { code: string; lang: string }) => {
    if (!this.state.initialized) {
      throw new Error(
        "CodeBlock has not been initialized. setupCodeBlock must be called with an array of language grammars prior to usage.",
      );
    }

    return toJsxRuntime(
      this.state.highlighter.codeToHast(code, {
        lang,
        theme: "vesper",
      }),
      jsxRuntime,
    );
  };
}

export const store = new CodeBlockStore();
