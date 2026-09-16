"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

export function Breadcrumbs({
  pageTitles,
}: {
  pageTitles: Record<string, string>;
}) {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div
      id="breadcrumbs"
      className="gap-vesper-4 md:pl-vesper-4 pr-vesper-4 flex flex-1 scrollbar-none overflow-auto"
    >
      {pathname !== "/" && <Separator />}
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;

        return (
          <Fragment key={href}>
            <Typography
              as={Link}
              href={href}
              aria-current={index === paths.length - 1 ? "page" : undefined}
              variant="copy-md-bold"
              className="shrink-0"
            >
              {/* a document's own title otherwise the slug for the app route (ex: `/components`) */}
              {pageTitles[href] ?? convertKebabToTitleCase(path)}
            </Typography>
            {index !== paths.length - 1 && <Separator />}
          </Fragment>
        );
      })}
    </div>
  );
}

const Separator = () => (
  <Typography
    as="span"
    variant="copy-md-bold"
    className="text-vesper-text-tertiary"
    aria-hidden
  >
    /
  </Typography>
);
