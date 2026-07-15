import type { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { store } from "./store";

export const { setupCodeBlock } = store;

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  lang: string;
  children?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  className,
  children: code = "",
  lang,
  showLineNumbers = false,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "vesper-code-block",
        showLineNumbers && "vesper-code-block-with-line-numbers",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: store.codeToHtml({ code, lang }) }}
      {...props}
    />
  );
}
