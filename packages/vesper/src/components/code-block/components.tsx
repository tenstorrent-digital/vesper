"use client";

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(
    () => () => {
      if (timeout.current !== null) clearTimeout(timeout.current);
    },
    [],
  );

  const copyToClipboard = useCallback((content: string) => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }

    navigator.clipboard
      ?.writeText(content)
      .then(() => {
        setCopied(true);
        timeout.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, []);

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
        const content = pre?.textContent || "";
        copyToClipboard(content);
      }}
    />
  );
}
