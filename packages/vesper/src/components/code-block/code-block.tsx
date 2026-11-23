import type { Lang } from "@pierre/highlights";
import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { HighlightedCode } from "./highlighted-code";
import { StreamingCodeBlock } from "./streaming-code-block";
import { codeToLines } from "./utils";

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
   * The language syntax of the supplied code, as a language name or alias (e.g. `"typescript"` or `"ts"`). Every language supported by `@pierre/highlights` is built in, so no grammars need to be supplied.
   *
   * Use `"ansi"` for text containing ANSI escape sequences, such as terminal output. Omitting this prop, or passing a language that isn't supported, renders the code as plain text with no syntax highlighting.
   *
   * @see https://diffs.com/docs#highlights
   * @default "text"
   */
  lang?: Lang | (string & {});
  /** Whether or not to show line numbers on the left-hand side of the code block. @default false */
  showLineNumbers?: boolean;
}

/**
 * A syntax-highlighted code block with support for static code, streaming content, and line numbers.
 *
 * @param {string | (() => ReadableStream<string> | Promise<ReadableStream<string>>)} [props.children] - (optional) The code to render, either as a string or a stream factory
 * @param {Lang | string} [props.lang] - (optional) The language syntax for highlighting. Unsupported languages render as plain text. @default "text"
 * @param {boolean} [props.showLineNumbers] - (optional) Whether to display line numbers. @default false
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <CodeBlock lang="javascript" showLineNumbers>
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
    ...rest
  } = props;

  if (typeof code === "function") {
    return (
      <StreamingCodeBlock
        className={className}
        lang={lang}
        showLineNumbers={showLineNumbers}
        {...rest}
      >
        {code}
      </StreamingCodeBlock>
    );
  }

  return (
    <div className={cn("vesper-code-block", className)} {...rest}>
      <CodeBlockPreWrapper data-line-numbers={showLineNumbers}>
        <HighlightedCode lines={codeToLines(code, lang)} />
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}
