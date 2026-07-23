"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@repo/vesper/typography";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div id="breadcrumbs" aria-label="Breadcrumbs">
      {paths.map((path, index) => (
        <Fragment key={index}>
          <Link href={`/${path}`}>
            <Typography as="span" variant="copy-md-bold">
              {" "}
              {path}
            </Typography>
          </Link>
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
