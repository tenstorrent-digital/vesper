// type definitions for MD / MDX frontmatter

interface Frontmatter {
  [key: string]: string;
}

declare module "*.mdx" {
  export { default } from "*.mdx";
  export const frontmatter: Frontmatter;
}

declare module "*.md" {
  export { default } from "*.md";
  export const frontmatter: Frontmatter;
}
