import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";
import {
  Typography,
  type TypographyProps,
} from "@/components/typography/typography";

export const CHIP_VARIANTS = ["default", "contrast"] as const;

export type ChipVariant = (typeof CHIP_VARIANTS)[number];

export type ChipProps<E extends ElementType = "button"> = Polymorphic<
  {
    variant?: ChipVariant;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
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
    ...rest
  } = props;

  return (
    <Typography
      as={Component}
      variant="label-md"
      className={cn("vesper-chip", `vesper-chip-${variant}`, className)}
      {...(rest as TypographyProps<E>)}
    >
      {iconLeft && <span className="vesper-chip-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-chip-icon">{iconRight}</span>}
    </Typography>
  );
}
