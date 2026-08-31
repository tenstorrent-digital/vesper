"use client";

import { usePathname } from "next/navigation";

import { Button } from "@tenstorrent/vesper/button";

export const PlaygroundLink = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");

  let storybookUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "/storybook";

  const isComponentPage =
    pathname.startsWith("/components/") &&
    // get the component name from the pathname (first segment is empty
    // because pathnames start with `/`)
    pathSegments.length === 3;

  if (isComponentPage) {
    const componentName = pathSegments[2];
    storybookUrl += `?path=/story/components-${componentName}--playground`;
  }

  return (
    <Button
      className="playground-link"
      as="a"
      href={storybookUrl.toString()}
      variant="tertiary"
      size="sm"
    >
      <span className="mobile">Play</span>
      <span className="desktop">Playground</span>
    </Button>
  );
};
