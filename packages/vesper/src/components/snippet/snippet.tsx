import { type ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

export const SNIPPET_VARIANTS = ["default", "contrast"] as const;

export type SnippetVariant = (typeof SNIPPET_VARIANTS)[number];

export interface SnippetProps extends Omit<ComponentProps<"div">, "children"> {
  children?: string;
  variant?: SnippetVariant;
}

export function Snippet({
  className,
  children = "",
  variant = "default",
  ...props
}: SnippetProps) {
  return (
    <Typography
      as="div"
      variant="copy-xs-mono"
      className={cn("vesper-snippet", `vesper-snippet-${variant}`, className)}
      {...props}
    >
      <pre>
        <code>
          {children.split("\n").map((line, index) => (
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
        onClick={() => navigator.clipboard.writeText(children)}
      />
    </Typography>
  );
}
