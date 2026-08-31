"use client";

import type { ComponentProps } from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

import { cn } from "@/utils/cn";

export const SCROLL_THUMB_VISIBILITIES = ["always", "on-interaction"] as const;

export const SCROLL_THUMB_VARIANTS = ["default", "inverse"] as const;

export type ScrollThumbVisibility = (typeof SCROLL_THUMB_VISIBILITIES)[number];

export type ScrollThumbVariant = (typeof SCROLL_THUMB_VARIANTS)[number];

export interface ScrollAreaProps extends ComponentProps<"div"> {
  /** Determines the color scheme of the scrollbar thumbs. @default default */
  thumbVariant?: ScrollThumbVariant;
  /** Determines the behavior of scrollbar thumb visibility.
   * `"always"` means the scrollbar thumbs will always be visible when there is overflow.
   * `"automatic"` means scrollbars will only be visible when there is overflow *and* the scroll area is being interacted with.
   *
   * @default always */
  thumbVisibility?: ScrollThumbVisibility;
}

/**
 * ScrollArea component description, params, and example usage
 *
 * @param {boolean} [props.thumbVariant] - (optional) Determines the color scheme of the scrollbar thumbs. @default default
 * @param {ParamType} [props.thumbVisibility] - (optional) Determines the behavior of scrollbar thumb visibility. @default always
 * `"always"` means the scrollbar thumbs will always be visible when there is overflow.
 * `"on-interaction"` means scrollbars will only be visible when there is overflow *and* the scroll area is being interacted with.
 * @default automatic
 *
 * @example
 * <ScrollArea behavior="always">
 *   {releaseNotes}
 * </ScrollArea>
 */
export function ScrollArea(props: ScrollAreaProps) {
  const {
    className,
    children,
    thumbVisibility = "always",
    thumbVariant = "default",
    ...rest
  } = props;

  return (
    <BaseScrollArea.Root
      {...rest}
      className={cn("vesper-scroll-area", className)}
    >
      <BaseScrollArea.Viewport className="vesper-scroll-area-viewport">
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      <ScrollBar
        orientation="vertical"
        thumbVariant={thumbVariant}
        thumbVisibility={thumbVisibility}
      />
      <ScrollBar
        orientation="horizontal"
        thumbVariant={thumbVariant}
        thumbVisibility={thumbVisibility}
      />
    </BaseScrollArea.Root>
  );
}

function ScrollBar({
  orientation,
  thumbVariant,
  thumbVisibility,
}: {
  orientation: "horizontal" | "vertical";
  thumbVariant: ScrollThumbVariant;
  thumbVisibility: ScrollThumbVisibility;
}) {
  return (
    <BaseScrollArea.Scrollbar
      data-visibility={thumbVisibility}
      className="vesper-scroll-area-scrollbar"
      orientation={orientation}
    >
      <BaseScrollArea.Thumb
        className={cn(
          "vesper-scroll-area-thumb",
          `vesper-scroll-area-thumb-${thumbVariant}`,
        )}
      />
    </BaseScrollArea.Scrollbar>
  );
}
