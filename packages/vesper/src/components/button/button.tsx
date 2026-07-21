import type { ElementType, ReactNode } from "react";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
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
    /** The size of the button. Affects padding and font size. @default "lg" */
    size?: ButtonSize;
    /** The visual style variant of the button. @default "primary" */
    variant?: ButtonVariant;
    /** When true, renders the button in a disabled state and prevents interaction. */
    disabled?: boolean;
    /** An optional icon element rendered to the left of the button content. */
    iconLeft?: ReactNode;
    /** An optional icon element rendered to the right of the button content. */
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
      {...rest}
      {...getDisabledProps(Component, !!disabled)}
    >
      {iconLeft && <span className="vesper-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-button-icon">{iconRight}</span>}
    </Component>
  );
}
