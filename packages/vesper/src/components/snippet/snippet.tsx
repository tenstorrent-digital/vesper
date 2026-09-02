"use client";

import { type ComponentProps, useEffect, useState } from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Checkmark, Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SNIPPET_VARIANTS = ["default", "contrast"] as const;

export type SnippetVariant = (typeof SNIPPET_VARIANTS)[number];

export interface SnippetProps extends Omit<ComponentProps<"div">, "children"> {
  /** The code text to display in the snippet. Also used as the value copied to the clipboard when the copy button is clicked. */
  children?: string;
  /** The visual style variant of the snippet. @default fault */
  variant?: SnippetVariant;
}

/**
 * A copyable code snippet component that displays monospace text with a built-in copy-to-clipboard button.
 *
 * @param {string} [props.children] - (optional) The code text to display and copy to clipboard
 * @param {SnippetVariant} [props.variant] - (optional) The visual style variant of the snippet. @default default`
 * @param {string} [props.className] - (optional) Additional CSS class names to apply
 *
 * You may also pass any additional props to the underlying `<div>` element
 *
 * @example
 * <Snippet>yarn add some-package</Snippet>
 *
 * @example
 * <Snippet variant="contrast">
 *   {`export default function App() {\n  return <div />\n}`}
 * </Snippet>
 */
export function Snippet(props: SnippetProps) {
  const { className, children, variant = "default", ...rest } = props;

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <div
      className={cn("vesper-snippet", `vesper-snippet-${variant}`, className)}
      {...rest}
    >
      <pre>
        <Typography as="code" variant="copy-xs-mono">
          {(children ?? "").split("\n").map((line, index) => (
            <span key={index} className="line">
              {line}
            </span>
          ))}
        </Typography>
      </pre>
      <IconButton
        variant={variant === "default" ? "ghost" : "contrast"}
        icon={copied ? <Checkmark /> : <Copy />}
        aria-label="Copy code"
        size="xs"
        type="button"
        onClick={() =>
          navigator.clipboard
            ?.writeText(children ?? "")
            .then(() => setCopied(true))
            .catch(() => {})
        }
      />
    </div>
  );
}
