"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@repo/vesper/typography";

import { convertKebabToPascalCase } from "@/lib/filesystem/utils";

export const Tree = ({ pages }: { pages: string[] }) => {
  const pathname = usePathname();

  return (
    <>
      {pages.map((page) => (
        <Link
          href={`/components/${page}`}
          data-active={pathname.split("/").pop() === page || undefined}
          key={page}
        >
          <Typography variant="heading-xs">
            {convertKebabToPascalCase(page)}
          </Typography>
        </Link>
      ))}
    </>
  );
};
