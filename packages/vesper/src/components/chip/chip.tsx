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
    variant?: ChipVariant;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    selected?: boolean;
    disabled?: boolean;
    onChange?(selected: boolean): void;
  },
  E
>;

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
