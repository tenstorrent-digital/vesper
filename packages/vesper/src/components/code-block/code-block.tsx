import { cn } from "@/utils/cn";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { StreamingCodeBlock } from "./streaming-code-block";
import type { CodeBlockProps } from "./types";
import { codeToJsx, handleLanguageRegistration } from "./utils";

export type { CodeBlockProps } from "./types";

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
