import type { ElementType, ReactNode } from "react";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const BUTTON_SIZES = ["xs", "sm", "md", "lg"] as const;

export const BUTTON_VARIANTS = [
  "contrast",
  "danger",
  "ghost",
  "primary",
  "subtle",
  "tertiary",
  "warning",
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export type ButtonSize = (typeof BUTTON_SIZES)[number];

export type ButtonProps<E extends ElementType = "button"> = Polymorphic<
  {
    size?: ButtonSize;
    variant?: ButtonVariant;
    disabled?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  },
  E
>;

export function Button<E extends ElementType = "button">(
  props: ButtonProps<E>,
) {
  const {
    as: Component = "button",
    size = "lg",
    variant = "primary",
    iconLeft,
    iconRight,
    children,
    className,
    disabled,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-button",
        `vesper-button-${size}`,
        `vesper-button-${disabled ? "disabled" : variant}`,
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {iconLeft && <span className="vesper-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-button-icon">{iconRight}</span>}
    </Component>
  );
}
