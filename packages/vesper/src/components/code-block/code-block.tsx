import type { ComponentProps } from "react";
import type { LanguageRegistration } from "@shikijs/core";

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
   */
  children?:
    | string
    | (() => ReadableStream<string> | Promise<ReadableStream<string>>);
  /**
   * The language syntax of the supplied code. Omitting this prop will render supplied code as plain text with no syntax highlighting.
   *
   * For `plaintext` and `ansi` you do not need to supply your own grammars; they are baked into shiki and can be passed in as strings. Other language grammars should be provided as plain objects, most of which can be imported from the `@shikijs/langs` library.
   *
   * @see https://shiki.style/languages for a list of available languages along with their `id`s
   * */
  lang?: LanguageRegistration[] | "text" | "ansi";
  /** Whether or not to show line numbers on the left-hand side of the code block. @default false */
  showLineNumbers?: boolean;
  /** Hide the copy-to-clipboard button until CodeBlock is hovered. @default false */
  copyOnHover?: boolean;
}

/**
 * A syntax-highlighted code block with support for static code, streaming content, line numbers, and Shiki transformers.
 *
 * @param {string | (() => ReadableStream<string> | Promise<ReadableStream<string>>)} [props.children] - (optional) The code to render, either as a string or a stream factory
 * @param {LanguageRegistration[] | "text" | "ansi"} [props.lang] - (optional) The language syntax for highlighting. @default text
 * @param {boolean} [props.showLineNumbers] - (optional) Whether to display line numbers. Has no effect when rendering streamed code. @default false
 * @param {ShikiTransformer[]} [props.transformers] - (optional) An array of Shiki transformers to apply to the hast tree. Has no effect when rendering streamed code
 * @param {boolean} [props.copyOnHover] - (optional) Hide the copy button until the code block is hovered. @default false
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * import javascript from "@shikijs/langs/javascript";
 *
 * <CodeBlock lang={javascript} showLineNumbers>
 *   {`const greeting = "Hello, world!";\nconsole.log(greeting);`}
 * </CodeBlock>
 *
 * @example
 * <CodeBlock lang="ansi">
 *   {buildLogs}
 * </CodeBlock>
 */
export function CodeBlock(props: CodeBlockProps) {
  const {
    className,
    children: code = "",
    lang = "text",
    showLineNumbers = false,
    copyOnHover = false,
    ...rest
  } = props;

  handleLanguageRegistration(lang);

  if (typeof code === "function") {
    return (
      <StreamingCodeBlock
        className={className}
        lang={lang}
        copyOnHover={copyOnHover}
        showLineNumbers={showLineNumbers}
        {...rest}
      >
        {code}
      </StreamingCodeBlock>
    );
  }

  return (
    <div
      className={cn("vesper-code-block", className)}
      data-copy-on-hover={copyOnHover}
      {...rest}
    >
      <CodeBlockPreWrapper data-line-numbers={showLineNumbers}>
        {codeToJsx(code, lang)}
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}
