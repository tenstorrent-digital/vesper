import Link from "next/link";

import { ArrowLeft, ArrowRight } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import type { NavPage } from "@/lib/nav";

/** the prev/next pair at the bottom of every document */
export const DocFooter = ({
  previous,
  next,
}: {
  previous?: NavPage;
  next?: NavPage;
}) => {
  if (!previous && !next) return null;

  return (
    <nav className="doc-footer" aria-label="Previous and next page">
      {previous && (
        <Link
          href={previous.href}
          className="doc-footer-link"
          data-direction="previous"
        >
          <Typography
            as="span"
            variant="label-xs-mono"
            className="doc-footer-direction"
          >
            <ArrowLeft width={12} height={12} /> Previous
          </Typography>
          <Typography as="span" variant="copy-md-bold">
            {previous.title}
          </Typography>
        </Link>
      )}

      {next && (
        <Link
          href={next.href}
          className="doc-footer-link"
          data-direction="next"
        >
          <Typography
            as="span"
            variant="label-xs-mono"
            className="doc-footer-direction"
          >
            Next <ArrowRight width={12} height={12} />
          </Typography>
          <Typography as="span" variant="copy-md-bold">
            {next.title}
          </Typography>
        </Link>
      )}
    </nav>
  );
};
