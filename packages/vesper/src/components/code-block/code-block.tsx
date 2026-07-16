import { type ComponentProps } from "react";
import { type ShikiTransformer } from "@shikijs/core";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { store } from "./store";

export const { setupCodeBlock } = store;

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  lang?: string;
  code?: string;
  showLineNumbers?: boolean;
  transformers?: ShikiTransformer[];
}

export function CodeBlock({
  className,
  code = "",
  lang = "text",
  showLineNumbers = false,
  transformers,
  ...props
}: CodeBlockProps) {
  return (
    <Typography
      as="div"
      data-line-numbers={showLineNumbers}
      variant="copy-xs-mono"
      className={cn("vesper-code-block", className)}
      {...props}
    >
      {store.codeToJsx({ code, lang, transformers })}
      <IconButton
        variant="tertiary"
        icon={<Copy />}
        aria-label="Copy code"
        size="sm"
        type="button"
        onClick={() => navigator.clipboard.writeText(code)}
      />
    </Typography>
  );
}
