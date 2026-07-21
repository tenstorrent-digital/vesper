import * as jsxRuntime from "react/jsx-runtime";
import {
  createHighlighterCore,
  type HighlighterCore,
  type LanguageInput,
  type ShikiTransformer,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { CodeToTokenTransformStream } from "@shikijs/stream";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";

import { theme } from "./theme";

type CodeBlockStoreState =
  | { highlighter: null; initialized: false }
  | { highlighter: null; initialized: false }
  | { highlighter: HighlighterCore; initialized: true };

class CodeBlockStore {
  setup: null | Promise<void> = null;
  state: CodeBlockStoreState = {
    initialized: false,
    highlighter: null,
  };

  /**
   * Setup function that must be called before rendering a `CodeBlock`. This function should only be called once in your application.
   * */
  setupCodeBlock = async ({
    langs,
    aliases,
  }: {
    /**
     * Array of language grammars to support. You can pick and choose which language grammars to support by importing them from the `@shikijs/langs` package. To support plaintext only, you can pass an empty array.
     *
     * To enable syntax highlighting for a custom language grammar, or a language grammar unsupported by the `@shikijs/langs` package, you can pass in a TextMate grammar object. For example, the llvm project has a custom [TextMate grammar for MLIR](https://github.com/llvm/llvm-project/blob/main/mlir/utils/textmate/mlir.json) on GitHub.
     *
     * @example
     * ```ts
     * await setupCodeBlock({
     *   langs: [
     *     import("@shikijs/langs/typescript"),
     *     import("@shikijs/langs/css"),
     *     import("@shikijs/langs/json"),
     *     import("@shikijs/langs/markdown"),
     *     import("@shikijs/langs/shellscript"),
     *   ],
     * });
     * ```
     */
    langs: LanguageInput[];
    /**
     * A record of aliases for the languages you wish to support. This field is optional.
     *
     * @example
     * ```ts
     * {
     *   js: 'javascript',
     *   ts: 'typescript',
     *   sh: 'shellscript',
     *   py: 'python',
     *   rs: 'rust',
     * }
     * ```
     * */
    aliases?: { [key: string]: string };
  }) => {
    if (this.state.initialized || this.setup !== null) {
      throw new Error(
        "CodeBlock was already initialized; setupCodeBlock should not be called more than once in your application.",
      );
    }

    this.setup = createHighlighterCore({
      langs,
      engine: createJavaScriptRegexEngine({ forgiving: true }),
      themes: [theme],
      langAlias: aliases,
    })
      .then((highlighter) => {
        this.state = { initialized: true, highlighter };
      })
      .finally(() => {
        this.setup = null;
      });

    await this.setup;
  };

  codeToStream = ({
    code,
    lang,
  }: {
    code: ReadableStream<string>;
    lang: string;
  }) => {
    this.requireInitialization();

    return code.pipeThrough(
      new CodeToTokenTransformStream({
        highlighter: this.state.highlighter!,
        lang,
        theme: "vesper",
        allowRecalls: true,
      }),
    );
  };

  codeToJsx = ({
    code,
    lang,
    transformers,
  }: {
    code: string;
    lang: string;
    transformers?: ShikiTransformer[];
  }) => {
    this.requireInitialization();

    return toJsxRuntime(
      this.state.highlighter!.codeToHast(code, {
        lang,
        theme: "vesper",
        transformers,
        tabindex: false,
      }),
      jsxRuntime,
    );
  };

  requireInitialization = () => {
    if (!this.state.initialized) {
      throw new Error(
        "CodeBlock has not been initialized. setupCodeBlock must be called with an array of language grammars prior to usage.",
      );
    }
  };

  reset = async () => {
    await Promise.resolve(this.setup);

    this.setup = null;
    this.state.highlighter?.dispose();
    this.state = {
      initialized: false,
      highlighter: null,
    };
  };
}

export const store = new CodeBlockStore();
