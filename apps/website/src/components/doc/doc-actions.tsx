"use client";

import { useState } from "react";

import { Button } from "@tenstorrent/vesper/button";
import {
  AIAgent,
  Checkmark,
  Copy,
  Document,
  SocialGitHub,
} from "@tenstorrent/vesper/icons";
import { addToast } from "@tenstorrent/vesper/toast";

import { GITHUB_URL } from "@/lib/constants";

type CopyState = "idle" | "markdown" | "prompt";

/**
 * the row of actions under a document's title
 *
 * every one of these exists because an agent asked for it (politely, by
 * scraping the rendered HTML and getting a faceful of `<div>`s)
 */
export const DocActions = ({
  href,
  title,
  sourcePath,
}: {
  /** the document's route, eg. `/components/button` */
  href: string;
  title: string;
  /** the document's path in the repo, eg. `docs/components/button.mdx` */
  sourcePath: string;
}) => {
  const [copied, setCopied] = useState<CopyState>("idle");

  const markdownUrl = `${href}.md`;

  const copy = async (kind: Exclude<CopyState, "idle">) => {
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(String(response.status));

      const markdown = await response.text();

      const payload =
        kind === "markdown"
          ? markdown
          : [
              `You are helping me use Vesper, Tenstorrent's React design system.`,
              `Below is the full documentation for "${title}".`,
              `Answer using only these APIs, and prefer the documented defaults.`,
              ``,
              `---`,
              ``,
              markdown,
            ].join("\n");

      await navigator.clipboard.writeText(payload);

      setCopied(kind);
      setTimeout(() => setCopied("idle"), 2000);

      addToast({
        variant: "success",
        timeout: 3500,
        content:
          kind === "markdown"
            ? `Copied ${title} as Markdown (${markdown.length.toLocaleString()} characters).`
            : `Copied ${title} as a ready-to-paste prompt.`,
      });
    } catch {
      addToast({
        variant: "danger",
        timeout: 5000,
        content: "Could not copy this page. Your clipboard said no.",
      });
    }
  };

  return (
    <div className="doc-actions">
      <Button
        size="xs"
        variant="tertiary"
        iconLeft={copied === "markdown" ? <Checkmark /> : <Copy />}
        onClick={() => void copy("markdown")}
      >
        {copied === "markdown" ? "Copied" : "Copy as Markdown"}
      </Button>

      <Button
        size="xs"
        variant="ghost"
        iconLeft={copied === "prompt" ? <Checkmark /> : <AIAgent />}
        onClick={() => void copy("prompt")}
      >
        {copied === "prompt" ? "Copied" : "Copy as prompt"}
      </Button>

      <Button
        size="xs"
        variant="ghost"
        as="a"
        href={markdownUrl}
        iconLeft={<Document />}
      >
        View raw
      </Button>

      <Button
        size="xs"
        variant="ghost"
        as="a"
        href={`${GITHUB_URL}/blob/main/${sourcePath}`}
        target="_blank"
        rel="noopener noreferrer"
        iconLeft={<SocialGitHub />}
      >
        Edit this page
      </Button>
    </div>
  );
};
