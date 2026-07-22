import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

import { Admonition } from "@repo/vesper/admonition";
import { Code } from "@repo/vesper/code";
import { Typography } from "@repo/vesper/typography";

import { CodeBlock } from "@/components/code-block";

import { trimChildren } from "@/lib/markdown/utils";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  h1: (props) => (
    <Typography as="h1" variant="display-lg">
      {props.children}
    </Typography>
  ),
  h2: (props) => (
    <Typography as="h2" variant="display-md">
      {props.children}
    </Typography>
  ),
  h3: (props) => (
    <Typography as="h3" variant="display-sm">
      {props.children}
    </Typography>
  ),
  h4: (props) => (
    <Typography as="h4" variant="heading-md">
      {props.children}
    </Typography>
  ),
  h5: (props) => (
    <Typography as="h5" variant="heading-sm">
      {props.children}
    </Typography>
  ),
  h6: (props) => (
    <Typography as="h6" variant="heading-xs">
      {props.children}
    </Typography>
  ),
  p: (props) => (
    <Typography as="p" variant="copy-md">
      {props.children}
    </Typography>
  ),
  strong: (props) => (
    <Typography as="strong" variant="copy-md-bold">
      {props.children}
    </Typography>
  ),
  code: (props) => <Code>{props.children}</Code>,
  blockquote: (props) => (
    <Admonition size="sm">{trimChildren(props.children)}</Admonition>
  ),
  pre: (props) => {
    const codeElement = props.children as React.ReactElement<{
      children?: string;
      className?: string;
    }>;
    const code = codeElement?.props?.children?.trim() ?? "";
    const lang = codeElement?.props?.className?.replace("language-", ""); // strip `language-`

    return (
      <CodeBlock
        lang={lang}
        // copyOnHover // add back after https://github.com/tenstorrent-digital/vesper/pull/65
      >
        {code}
      </CodeBlock>
    );
  },
  img: (props) => (
    <Image
      sizes="100vw"
      className="h-auto w-auto max-w-full"
      {...(props as ImageProps)}
    />
  ),
  li: (props) => (
    <Typography as="li" variant="copy-md">
      {props.children}
    </Typography>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
