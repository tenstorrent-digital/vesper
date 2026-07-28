"use client";

import type { ElementType, ReactNode } from "react";

import {
  Typography,
  type TypographyProps,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
import type { Polymorphic } from "@/utils/polymorphic";

export const CHIP_VARIANTS = ["default", "contrast"] as const;

export type ChipVariant = (typeof CHIP_VARIANTS)[number];

export type ChipProps<E extends ElementType = "button"> = Polymorphic<
  {
    /** The visual style variant of the chip. @default default */
    variant?: ChipVariant;
    /** An optional icon element rendered to the left of the chip content. */
    iconLeft?: ReactNode;
    /** An optional icon element rendered to the right of the chip content. */
    iconRight?: ReactNode;
    /** Whether the chip is currently selected. When rendered as a button, this value is reflected via `aria-pressed`. @default false */
    selected?: boolean;
    /** When `true`, renders the chip in a disabled state and prevents interaction. @default false */
    disabled?: boolean;
    /** Callback fired when the chip is clicked. Receives the next selected state as an argument. */
    onChange?(selected: boolean): void;
  },
  E
>;

/**
 * A polymorphic selectable chip component for displaying on/off states in UI panels and forms, supporting icons and click callbacks.
 *
 * Unlike `Tag` (which categorizes content) and `Badge` (which describes adjacent content), `Chips` represent toggleable selections.
 *
 * @see packages/vesper/src/components/badge/badge.tsx
 * @see packages/vesper/src/components/tag/tag.tsx
 *
 * @param {ChipVariant} [props.variant] - (optional) The visual style variant. @default default
 * @param {boolean} [props.selected] - (optional) Whether the chip is currently selected @default false
 * @param {boolean} [props.disabled] - (optional) Renders the chip in a disabled state @default false
 * @param {ReactNode} [props.iconLeft] - (optional) An icon rendered to the left of the chip content
 * @param {ReactNode} [props.iconRight] - (optional) An icon rendered to the right of the chip content
 * @param {(selected: boolean) => void} [props.onChange] - (optional) Callback fired with the next selected state when clicked
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default button
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <Chip selected={isActive} onChange={setIsActive}>
 *   Filter
 * </Chip>
 *
 * @example
 * <Chip variant="contrast" iconLeft={<Add />} disabled>
 *   Add tag
 * </Chip>
 */
export function Chip<E extends ElementType = "button">(props: ChipProps<E>) {
  const {
    as: Component = "button",
    variant = "default",
    children,
    iconLeft,
    iconRight,
    className,
    selected = false,
    disabled = false,
    onChange,
    onClick,
    ...rest
  } = props;

  return (
    <Typography
      as={Component}
      variant="label-md"
      aria-pressed={Component === "button" ? selected : undefined}
      className={cn(
        "vesper-chip",
        `vesper-chip-${variant}`,
        selected && `vesper-chip-selected`,
        disabled && `vesper-chip-disabled`,
        className,
      )}
      // TypeScript cannot infer the type of onClick because this component is polymorphic
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={(e: any) => {
        onChange?.(!selected);
        onClick?.(e);
      }}
      {...(rest as TypographyProps<E>)}
      {...getDisabledProps(Component, disabled)}
    >
      {iconLeft && <span className="vesper-chip-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-chip-icon">{iconRight}</span>}
    </Typography>
  );
}
