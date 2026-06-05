"use client";

import { BannerAlert, type BannerAlertProps } from "@repo/vesper/banner-alert";

const VARIANTS: BannerAlertProps["variant"][] = [
  "danger",
  "info",
  "secondary",
  "success",
  "warning",
];

const SIZES: BannerAlertProps["size"][] = ["sm", "md"];

export function BannerAlertPreview() {
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
                <BannerAlert size={size} variant={variant}>
                  {variant}
                </BannerAlert>
                <BannerAlert
                  size={size}
                  variant={variant}
                  cta={{ children: "explore" }}
                >
                  {variant}
                </BannerAlert>
                <BannerAlert subtle size={size} variant={variant}>
                  {variant}
                </BannerAlert>
                <BannerAlert
                  subtle
                  size={size}
                  variant={variant}
                  cta={{ children: "explore" }}
                >
                  {variant}
                </BannerAlert>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
