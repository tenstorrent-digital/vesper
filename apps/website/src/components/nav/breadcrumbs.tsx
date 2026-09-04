"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

import { convertKebabToTitleCase } from "@/lib/filesystem/utils";

export const Breadcrumbs = ({ titles }: { titles: Record<string, string> }) => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div
      id="breadcrumbs"
      aria-label="Breadcrumbs"
      className="breadcrumbs-scroll flex h-12 w-full min-w-0 flex-1 items-center gap-4 overflow-x-scroll overflow-y-hidden py-4 md:gap-2"
    >
      {pathname !== "/" && (
        <Typography
          as="span"
          className="opacity-50"
          variant="copy-md-bold"
          aria-hidden="true"
        >
          /
        </Typography>
      )}
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;

        return (
          <Fragment key={href}>
            <Typography
              className="shrink-0"
              as={Link}
              href={href}
              aria-current={index === paths.length - 1 ? "page" : undefined}
              variant="copy-md-bold"
            >
              {/* a document's own title otherwise the slug for the app route (ex: `/components`) */}
              {titles[href] ?? convertKebabToTitleCase(path)}
            </Typography>
            {index !== paths.length - 1 && (
              <Typography
                as="span"
                className="opacity-50"
                variant="copy-md-bold"
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
