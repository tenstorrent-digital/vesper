import * as jsxRuntime from "react/jsx-runtime";
import {
  createHighlighterCore,
  type ShikiTransformer,
  type HighlighterCore,
  type LanguageInput,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { CodeToTokenTransformStream } from "@shikijs/stream";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { theme } from "./theme";

type CodeBlockStoreState =
  | { highlighter: null; initialized: false }
  | { highlighter: HighlighterCore; initialized: true };

class CodeBlockStore {
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
    this.state = {
      initialized: true,
      highlighter: await createHighlighterCore({
        langs,
        engine: createJavaScriptRegexEngine(),
        themes: [theme],
        langAlias: aliases,
      }),
    };
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

  reset = () => {
    this.state = {
      initialized: false,
      highlighter: null,
    };
  };
}

export const store = new CodeBlockStore();
