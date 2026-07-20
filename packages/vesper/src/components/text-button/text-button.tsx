import type { ElementType, ReactNode } from "react";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
import type { Polymorphic } from "@/utils/polymorphic";

export const TEXT_BUTTON_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_BUTTON_VARIANTS = [
  "subtle",
  "contrast",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
  "purple",
  "pink",
] as const;

export type TextButtonSize = (typeof TEXT_BUTTON_SIZES)[number];

export type TextButtonVariant = (typeof TEXT_BUTTON_VARIANTS)[number];

export type TextButtonProps<E extends ElementType = "button"> = Polymorphic<
  {
    /** The size of the text button. Affects font size. Defaults to `"lg"`. */
    size?: TextButtonSize;
    /** The color variant of the text button. Defaults to `"accent"`. */
    variant?: TextButtonVariant;
    /** When `true`, renders the text button in a disabled state and prevents interaction. */
    disabled?: boolean;
    /** An optional icon element rendered to the left of the text button content. */
    iconLeft?: ReactNode;
    /** An optional icon element rendered to the right of the text button content. */
    iconRight?: ReactNode;
  },
  E
>;

export function TextButton<E extends ElementType>(props: TextButtonProps<E>) {
  const {
    as: Component = "button",
    size = "lg",
    variant = "accent",
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
        "vesper-text-button",
        `vesper-text-button-${size}`,
        `vesper-text-button-${disabled ? "disabled" : variant}`,
        className,
      )}
      {...rest}
      {...getDisabledProps(Component, !!disabled)}
    >
      {iconLeft && <span className="vesper-text-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && (
        <span className="vesper-text-button-icon">{iconRight}</span>
      )}
    </Component>
  );
}
