import { Children, type ReactNode } from "react";

/**
 * strips whitespace-only text nodes and `\n` newlines from the
 * start and end of `children`
 *
 * for use with parsed markdown from @next/mdx when you want breaks
 * _between_ paragraphs preserved for use with `white-space: pre-wrap`,
 * but not at the start or end of the content
 */
export const trimChildren = (children: ReactNode): ReactNode[] => {
  const content = Children.toArray(children);

  // remove whitespace-only text nodes
  while (
    content.length &&
    typeof content[0] === "string" &&
    !content[0].trim()
  ) {
    // from the start of the content
    content.shift();
  }
  while (
    content.length &&
    typeof content[content.length - 1] === "string" &&
    !(content[content.length - 1] as string).trim()
  ) {
    // from the end of the content
    content.pop();
  }

  return content;
};
