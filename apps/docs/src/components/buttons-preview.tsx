"use client";

import { ArrowUp, Tenstorrent } from "@repo/vesper/icons";
import { Button, BUTTON_SIZES, BUTTON_VARIANTS } from "@repo/vesper/button";
import { IconButton } from "@repo/vesper/icon-button";
import {
  TextButton,
  TEXT_BUTTON_SIZES,
  TEXT_BUTTON_VARIANTS,
} from "@repo/vesper/text-button";
import {
  SplitButton,
  SPLIT_BUTTON_SIZES,
  SPLIT_BUTTON_VARIANTS,
} from "@repo/vesper/split-button";

export function ButtonsPreview() {
  return (
    <div className="bg-vesper-stone-50 text-vesper-stone-900 flex flex-col gap-vesper-4 p-vesper-4">
      <div className="flex flex-wrap gap-vesper-4">
        {SPLIT_BUTTON_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-vesper-4 items-start">
            {SPLIT_BUTTON_SIZES.map((size) => (
              <div key={size} className="flex gap-vesper-4">
                <SplitButton
                  size={size}
                  variant={variant}
                  menuItems={[
                    {
                      text: "Save",
                      description: "Save changes",
                      onSelect() {},
                    },
                    {
                      text: "Save + Redeploy",
                      description:
                        "Save changes and create a new instance deployment",
                      onSelect() {},
                    },
                  ]}
                >
                  {variant}
                </SplitButton>
              </div>
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-vesper-4 items-start">
          {SPLIT_BUTTON_SIZES.map((size) => (
            <div key={size} className="flex gap-vesper-4">
              <SplitButton
                disabled
                size={size}
                variant="subtle"
                menuItems={[
                  {
                    text: "Save",
                    description: "Save changes",
                    onSelect() {},
                  },
                  {
                    text: "Save + Redeploy",
                    description:
                      "Save changes and create a new instance deployment",
                    onSelect() {},
                  },
                ]}
              >
                disabled
              </SplitButton>
            </div>
          ))}
        </div>
      </div>
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
        <div className="flex flex-col gap-vesper-4 items-start">
          {BUTTON_SIZES.map((size) => (
            <div key={size} className="flex gap-vesper-4">
              <Button
                size={size}
                variant="primary"
                iconLeft={<Tenstorrent />}
                disabled
              >
                disabled
              </Button>
              <IconButton
                size={size}
                variant="primary"
                icon={<ArrowUp />}
                disabled
              />
            </div>
          ))}
        </div>
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
        <div className="flex flex-col gap-vesper-4 items-start">
          {TEXT_BUTTON_SIZES.map((size) => (
            <div key={size} className="flex gap-vesper-4">
              <TextButton
                size={size}
                variant="success"
                iconLeft={<Tenstorrent />}
                disabled
              >
                disabled
              </TextButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
