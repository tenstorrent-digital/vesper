"use client";

import {
  Admonition,
  ADMONITION_VARIANTS,
  ADMONITION_SIZES,
} from "@repo/vesper/admonition";

export function AdmonitionPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <div className="flex flex-wrap gap-vesper-4">
        {ADMONITION_VARIANTS.map((variant) => (
          <div
            key={variant}
            className="flex-1 flex flex-col gap-vesper-4 items-start"
          >
            {ADMONITION_SIZES.map((size) => (
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
