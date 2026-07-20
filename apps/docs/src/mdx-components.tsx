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
  h1: (props) => <Typography variant="display-lg">{props.children}</Typography>,
  h2: (props) => <Typography variant="display-md">{props.children}</Typography>,
  h3: (props) => <Typography variant="display-sm">{props.children}</Typography>,
  h4: (props) => <Typography variant="heading-md">{props.children}</Typography>,
  h5: (props) => <Typography variant="heading-sm">{props.children}</Typography>,
  h6: (props) => <Typography variant="heading-xs">{props.children}</Typography>,
  p: (props) => <Typography variant="copy-md">{props.children}</Typography>,
  strong: (props) => (
    <Typography variant="copy-md-bold">{props.children}</Typography>
  ),
  code: (props) => <Code {...props} />,
  blockquote: (props) => (
    <Admonition size="sm" {...props}>
      {props.children}
    </Admonition>
  ),
  // codeBlock: (props) => <CodeBlock {...props} />, // throws client/server errors

  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
