"use client";

import { ArrowUp, Tenstorrent } from "@repo/vesper/icons";
import { Button, type ButtonProps } from "@repo/vesper/button";
import { TextButton, type TextButtonProps } from "@repo/vesper/text-button";
import { IconButton } from "@repo/vesper/icon-button";

const BUTTON_VARIANTS: ButtonProps["variant"][] = [
  "contrast",
  "danger",
  "disabled",
  "ghost",
  "primary",
  "subtle",
  "tertiary",
  "warning",
];

const BUTTON_SIZES: ButtonProps["size"][] = ["lg", "md", "sm", "xs"];

const TEXT_BUTTON_VARIANTS: TextButtonProps["variant"][] = [
  "accent",
  "contrast",
  "danger",
  "disabled",
  "info",
  "pink",
  "purple",
  "subtle",
  "success",
  "warning",
];

const TEXT_BUTTON_SIZES: TextButtonProps["size"][] = ["lg", "md", "sm"];

export function ButtonsPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <div className="flex flex-wrap gap-vesper-4">
        {BUTTON_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-vesper-4 items-start">
            {BUTTON_SIZES.map((size) => (
              <div key={size} className="flex gap-vesper-4">
                <Button
                  size={size}
                  variant={variant}
                  iconLeft={<Tenstorrent />}
                >
                  {variant}
                </Button>
                <IconButton size={size} variant={variant} icon={<ArrowUp />} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-vesper-4">
        {TEXT_BUTTON_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-vesper-4 items-start">
            {TEXT_BUTTON_SIZES.map((size) => (
              <div key={size} className="flex gap-vesper-4">
                <TextButton
                  size={size}
                  variant={variant}
                  iconLeft={<Tenstorrent />}
                >
                  {variant}
                </TextButton>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
