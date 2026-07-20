import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

import { Admonition } from "@repo/vesper/admonition";
import { Code } from "@repo/vesper/code";
// import { CodeBlock } from "@repo/vesper/code-block";
import { Typography } from "@repo/vesper/typography";

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
    <Typography as="p" variant="copy-sm">
      {props.children}
    </Typography>
  ),
  strong: (props) => (
    <Typography as="strong" variant="copy-sm-bold">
      {props.children}
    </Typography>
  ),
  code: (props) => <Code>{props.children}</Code>,
  blockquote: (props) => <Admonition size="sm">{props.children}</Admonition>,
  // codeBlock: (props) => <CodeBlock>{props.children}</CodeBlock>, // throws client/server errors

  img: (props) => (
    <Image
      sizes="100vw"
      className="w-auto h-auto max-w-full"
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
