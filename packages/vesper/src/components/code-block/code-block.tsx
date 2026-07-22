import type { ComponentProps } from "react";
import {
  type LanguageRegistration,
  type ShikiTransformer,
} from "@shikijs/core";

import { cn } from "@/utils/cn";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { StreamingCodeBlock } from "./streaming-code-block";
import { codeToJsx, handleLanguageRegistration } from "./utils";

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML" | "lang"
> {
  /**
   * The code to render. Can be a `string`, or a factory `() => ReadableStream<string>` if you wish to stream something like build logs, output from an LLM, etc.
   *
   * A factory is used instead of a raw `ReadableStream` because streams are single-use — once piped they are locked and cannot be re-read. Passing a factory allows the component to create a fresh stream whenever it needs one (e.g. on React Strict Mode remounts or language changes).
   *
   * The factory may be asynchronous, returning a `Promise<ReadableStream<string>>`, which is useful when the stream source itself requires an async setup step (e.g. making a network request).
   *
   * @example
   * <CodeBlock>
   *   const count = 0
   * </CodeBlock>
   *
   * @example
   * <CodeBlock lang={typescript}>
   *   {() => getCodeStream()}
   * </CodeBlock>
   */
  children?:
    | string
    | (() => ReadableStream<string> | Promise<ReadableStream<string>>);
  /**
   * The language syntax of the supplied code. Omitting this prop will render supplied code as plain text with no syntax highlighting.

   * For plaintext and ansi you do not need to supply your own grammars; they are baked into shiki and can be passed in as strings. Other language grammars should be provided as plain objects, most of which can be imported from the `@shikijs/langs` library.
   *
   * @example
   * // importing language grammar from @shikijs/langs
   * import javascript from "@shikijs/langs/javascript";
   *
   * <CodeBlock lang={javascript}>
   *   const count = 0
   * </CodeBlock>
   *
   * @example
   * // rendering ansi
   *
   * <CodeBlock lang="ansi">
   *   {buildLogs}
   * </CodeBlock>
   * */
  lang?: LanguageRegistration[] | "text" | "ansi";
  /**
   * Whether or not to show line numbers on the left-hand side of the code block. Note that if you are streaming code, line numbers will not appear.
   *
   * @example
   * <CodeBlock showLineNumbers>
   *   const count = 0
   * </CodeBlock>
   */
  showLineNumbers?: boolean;
  /**
   * An array of transformers to apply and manipulate the hast tree. For information on Shiki transformers, see [the shiki transformers guide](https://shiki.style/guide/transformers).
   *
   * Transforms will not apply to streamed code.
   *
   * @example
   * import { transformerNotationDiff } from '@shikijs/transformers'
   *
   * <CodeBlock transformers={[transformerNotationDiff()]}>
   *   const count = 0
   * </CodeBlock>
   */
  transformers?: ShikiTransformer[];
}

export function CodeBlock({
  className,
  children: code = "",
  lang = "text",
  showLineNumbers = false,
  transformers,
  ...props
}: CodeBlockProps) {
  handleLanguageRegistration(lang);

  if (typeof code === "function") {
    return (
      <StreamingCodeBlock className={className} lang={lang} {...props}>
        {code}
      </StreamingCodeBlock>
    );
  }

  return (
    <div className={cn("vesper-code-block", className)} {...props}>
      <CodeBlockPreWrapper data-line-numbers={showLineNumbers}>
        {codeToJsx(code, lang, transformers)}
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}
