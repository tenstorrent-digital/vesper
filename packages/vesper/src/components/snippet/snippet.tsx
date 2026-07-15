import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";

export const SNIPPET_VARIANTS = ["default", "contrast"] as const;

export type SnippetVariant = (typeof SNIPPET_VARIANTS)[number];

export interface SnippetProps extends Omit<ComponentProps<"div">, "children"> {
  code?: string;
  variant?: SnippetVariant;
}

export function Snippet({
  className,
  code = "",
  variant = "default",
  ...props
}: SnippetProps) {
  return (
    <div
      className={cn(
        "vesper-snippet",
        `vesper-snippet-${variant}`,
        "vesper-typography",
        "vesper-typography-copy-xs-mono",
        className,
      )}
      {...props}
    >
      <pre tabIndex={0}>
        <code>
          {code.split("\n").map((line, index) => (
            <span key={index} className="line">
              {line}
            </span>
          ))}
        </code>
      </pre>
      <IconButton
        variant={variant === "default" ? "ghost" : "contrast"}
        icon={<Copy />}
        aria-label="Copy code"
        size="xs"
        type="button"
        onClick={() => navigator.clipboard.writeText(code)}
      />
    </div>
  );
}
