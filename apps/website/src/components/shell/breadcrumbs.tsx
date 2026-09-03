"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

/**
 * the path trail rendered next to the wordmark in the top bar
 *
 * `titles` is built on the server from every page's frontmatter, so a segment
 * can be labelled with its real title without reading the filesystem here
 */
export const Breadcrumbs = ({ titles }: { titles: Record<string, string> }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return <div className="topbar-crumbs" />;

  return (
    <div className="topbar-crumbs" aria-label="Breadcrumbs">
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const last = index === segments.length - 1;

        return (
          <Fragment key={href}>
            <Typography
              as={Link}
              href={href}
              className="crumb"
              variant={last ? "copy-sm-bold" : "copy-sm"}
              aria-current={last ? "page" : undefined}
            >
              {titles[href] ?? convertKebabToTitleCase(segment)}
            </Typography>

            {!last && (
              <Typography
                as="span"
                className="crumb-divider"
                variant="copy-sm"
                aria-hidden="true"
              >
                /
              </Typography>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
