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
    /** The visual style variant of the chip. Defaults to `"default"` */
    variant?: ChipVariant;
    /** An optional icon element rendered to the left of the chip content. */
    iconLeft?: ReactNode;
    /** An optional icon element rendered to the right of the chip content. */
    iconRight?: ReactNode;
    /** Whether the chip is currently selected. When rendered as a button, this value is reflected via `aria-pressed`. */
    selected?: boolean;
    /** When `true`, renders the chip in a disabled state and prevents interaction. */
    disabled?: boolean;
    /** Callback fired when the chip is clicked. Receives the next selected state as an argument. */
    onChange?(selected: boolean): void;
  },
  E
>;

/**
 * A polymorphic toggleable chip component that can be selected or deselected. Supports leading and trailing icons.
 *
 * @example
 * <Chip selected={isSelected} onChange={setIsSelected}>
 *   Featured
 * </Chip>
 *
 * @example
 * // With icons
 * <Chip iconLeft={<Phone />} variant="contrast">
 *   Mobile-only
 * </Chip>
 *
 * @example
 * // Polymorphic usage as a link
 * <Chip as="a" href="/category/featured">
 *   Featured
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
    selected,
    disabled,
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
      {...getDisabledProps(Component, !!disabled)}
    >
      {iconLeft && <span className="vesper-chip-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-chip-icon">{iconRight}</span>}
    </Typography>
  );
}
