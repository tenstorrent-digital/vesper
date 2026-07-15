import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { store } from "./store";

export const { setupCodeBlock } = store;

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  lang?: string;
  code?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  className,
  code = "",
  lang = "text",
  showLineNumbers = false,
  ...props
}: CodeBlockProps) {
  return (
    <div
      data-line-numbers={showLineNumbers}
      className={cn("vesper-code-block", className)}
      {...props}
    >
      {store.codeToJsx({ code, lang })}
      <div className="vesper-code-block-copy-button-container">
        <IconButton
          variant="tertiary"
          icon={<Copy />}
          aria-label="Copy code"
          size="sm"
          type="button"
          onClick={() => navigator.clipboard.writeText(code)}
        />
      </div>
    </div>
  );
}
