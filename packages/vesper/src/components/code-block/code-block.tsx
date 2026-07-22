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
   * The code to render. Can be a `string`, or a `ReadableStream<string>` if you wish to stream something like build logs, output from an LLM, etc.
   *
   * @example
   * <CodeBlock>
   *   const count = 0
   * </CodeBlock>
   */
  children?: string | ReadableStream<string>;
  /**
   * The language syntax of the supplied code. The language must correspond to one of the languages registered when calling `setupCodeBlock`. Omitting this prop will render supplied code as plain text with no syntax highlighting.
   *
   * @example
   * <CodeBlock lang="javascript">
   *   const count = 0
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

  if (typeof code !== "string") {
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
