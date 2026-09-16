"use client";

import { type MouseEventHandler, useCallback, useRef, useState } from "react";

import { Button, type ButtonProps } from "@tenstorrent/vesper/button";
import { Checkmark, Copy } from "@tenstorrent/vesper/icons";

export function CopyToClipboardButton({
  textToCopy,
  onClick,
  ...props
}: ButtonProps & { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const timeout = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = useCallback(() => {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
    }

    navigator.clipboard
      ?.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        timeout.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }, [textToCopy]);

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      copyToClipboard();
    },
    [onClick, copyToClipboard]
  );

  return (
    <Button
      size="xs"
      variant="tertiary"
      onClick={handleClick}
      iconRight={copied ? <Checkmark /> : <Copy />}
      {...props}
    />
  );
}
