"use client";

import { type ComponentProps, useEffect, useState } from "react";

import { IconButton } from "@/components/icon-button/icon-button";
import { Checkmark, Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

export function CodeBlockPreWrapper({
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <Typography
      as="div"
      variant="copy-xs-mono"
      className="vesper-code-block-pre-wrapper"
      {...props}
    >
      {children}
    </Typography>
  );
}

export function CopyToClipboardButton() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <IconButton
      variant="tertiary"
      icon={copied ? <Checkmark /> : <Copy />}
      aria-label="Copy code"
      size="sm"
      type="button"
      onClick={(e) => {
        const pre =
          e.currentTarget.parentElement?.querySelector<HTMLDivElement>(
            ".vesper-code-block-pre-wrapper",
          );

        /**
         * If a consumer supplies transformers to a code block instance, the passed in code string may contain hidden comments that tell the highlighter to output modified hast nodes. In such cases we want to copy the rendered text content because it will omit those hidden comments.
         */
        const content = pre?.textContent || "";
        navigator.clipboard
          ?.writeText(content)
          .then(() => setCopied(true))
          .catch(() => {});
      }}
    />
  );
}
