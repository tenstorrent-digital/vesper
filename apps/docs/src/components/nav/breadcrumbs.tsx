"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div id="breadcrumbs" aria-label="Breadcrumbs">
      {paths.map((path, index) => (
        <Fragment key={index}>
          <Typography
            as={Link}
            href={`/${paths.slice(0, index + 1).join("/")}`}
            variant="copy-md-bold"
          >
            {path}
          </Typography>
          {index !== paths.length - 1 && (
            <Typography as="span" className="divider" variant="copy-md-bold">
              →
            </Typography>
          )}
        </Fragment>
      ))}
    </div>
  );
};
