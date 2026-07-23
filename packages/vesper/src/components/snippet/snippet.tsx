"use client";

import { type ComponentProps } from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SNIPPET_VARIANTS = ["default", "contrast"] as const;

export type SnippetVariant = (typeof SNIPPET_VARIANTS)[number];

export interface SnippetProps extends Omit<ComponentProps<"div">, "children"> {
  /** The code text to display in the snippet. Also used as the value copied to the clipboard when the copy button is clicked. */
  children?: string;
  /** The visual style variant of the snippet. Defaults to `"default"`. */
  variant?: SnippetVariant;
}

export function Snippet(props: SnippetProps) {
  const { className, children = "", variant = "default", ...rest } = props;

  return (
    <Typography
      as="div"
      variant="copy-xs-mono"
      className={cn("vesper-snippet", `vesper-snippet-${variant}`, className)}
      {...rest}
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
