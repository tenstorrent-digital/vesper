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
     * Array of language grammars to support. You can install the `@shikijs/langs` package and pick and choose which languages to support by importing the individual grammars. To support plaintext only, you can pass an empty array.
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
}

export const store = new CodeBlockStore();
