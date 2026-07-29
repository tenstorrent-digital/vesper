import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import {
  type BundledLanguage,
  bundledLanguages,
  type LanguageRegistration,
} from "shiki/bundle/web";

import { Admonition } from "@tenstorrent/vesper/admonition";
import { Code } from "@tenstorrent/vesper/code";
import { CodeBlock } from "@tenstorrent/vesper/code-block";
import { Typography } from "@tenstorrent/vesper/typography";

import { trimChildren } from "@/lib/markdown/utils";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components = {
  h1: (props) => (
    <Typography as="h1" variant="heading-2xl">
      {props.children}
    </Typography>
  ),
  h2: (props) => (
    <Typography as="h2" variant="heading-xl">
      {props.children}
    </Typography>
  ),
  h3: (props) => (
    <Typography as="h3" variant="heading-lg">
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
  a: (props) => (
    <Link
      target={props.href.startsWith("http") ? "_blank" : undefined}
      rel={props.href.startsWith("http") ? "noopener noreferrer" : undefined}
      href={props.href}
    >
      {props.children}
    </Link>
  ),
  code: (props) => <Code>{props.children}</Code>,
  blockquote: (props) => (
    <Admonition size="sm">{trimChildren(props.children)}</Admonition>
  ),
  pre: async (props) => {
    const codeElement = props.children as React.ReactElement<{
      children?: string;
      className?: string;
    }>;
    const code = codeElement?.props?.children?.trim() ?? "";
    const lang = codeElement?.props?.className?.replace("language-", "");

    let resolvedLang: LanguageRegistration[] | "text" = "text";

    // check if language is included in bundled languages
    if (lang && lang in bundledLanguages) {
      // if it is, get the ES module directly and grab the `LanguageRegistration`
      // by using the default export
      resolvedLang = (await bundledLanguages[lang as BundledLanguage]())
        .default;
    }

    return (
      <CodeBlock className="max-w-full" lang={resolvedLang} copyOnHover>
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
