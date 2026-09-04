import { Typography } from "@tenstorrent/vesper/typography";

import { DocActions } from "./doc-actions";

/**
 * the masthead above a document's body
 *
 * the title and description come from frontmatter, so the `# Heading` and lede
 * paragraph a markdown file starts with are hidden by `mdx-components.tsx`
 * (see `PROSE_DROPS_FIRST_HEADING`) and rendered here instead
 */
export const DocHeader = ({
  section,
  title,
  description,
  href,
  sourcePath,
  readingTime,
}: {
  section: string;
  title: string;
  description?: string;
  href: string;
  sourcePath: string;
  /** estimated minutes to read, from the document's word count */
  readingTime: number;
}) => (
  <header className="doc-header">
    <Typography as="div" variant="label-xs-mono" className="doc-eyebrow">
      {section}
      <span aria-hidden="true">·</span>
      {readingTime} min read
    </Typography>

    <Typography as="h1" variant="heading-2xl" className="doc-title">
      {title}
    </Typography>

    {description && (
      <Typography variant="copy-lg" className="doc-description">
        {description}
      </Typography>
    )}

    <DocActions href={href} title={title} sourcePath={sourcePath} />
  </header>
);
