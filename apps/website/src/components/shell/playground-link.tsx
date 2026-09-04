"use client";

import { usePathname } from "next/navigation";

import { Button } from "@tenstorrent/vesper/button";

import { STORYBOOK_PORT } from "@/lib/constants";

/**
 * deep-links into Storybook
 *
 * on a component page it opens that component's playground story directly,
 * everywhere else it opens Storybook's root
 */
export const PlaygroundLink = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");

  let url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:${STORYBOOK_PORT}`
      : "/storybook";

  // `/components/<name>` — the first segment is empty (paths start with "/")
  if (pathname.startsWith("/components/") && segments.length === 3) {
    url += `?path=/story/components-${segments[2]}--playground`;
  }

  return (
    <Button
      className="topbar-only-wide"
      as="a"
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      variant="tertiary"
      size="sm"
    >
      Playground
    </Button>
  );
};
