"use client";

import { Admonition, type AdmonitionProps } from "@repo/vesper/admonition";

const VARIANTS: AdmonitionProps["variant"][] = [
  "danger",
  "info",
  "secondary",
  "success",
  "warning",
];

const SIZES: AdmonitionProps["size"][] = ["sm", "md"];

export function AdmonitionPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <div className="flex flex-wrap gap-vesper-4">
        {VARIANTS.map((variant) => (
          <div
            key={variant}
            className="flex-1 flex flex-col gap-vesper-4 items-start"
          >
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col gap-vesper-4 w-full">
                <Admonition size={size} variant={variant}>
                  {variant}
                </Admonition>
                <Admonition
                  size={size}
                  variant={variant}
                  cta={{ children: "explore" }}
                >
                  {variant}
                </Admonition>
                <Admonition subtle size={size} variant={variant}>
                  {variant}
                </Admonition>
                <Admonition
                  subtle
                  size={size}
                  variant={variant}
                  cta={{ children: "explore" }}
                >
                  {variant}
                </Admonition>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
