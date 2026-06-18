import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

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
    size?: TextButtonSize;
    variant?: TextButtonVariant;
    disabled?: boolean;
    iconLeft?: ReactNode;
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
      disabled={disabled}
      {...rest}
    >
      {iconLeft && <span className="vesper-text-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && (
        <span className="vesper-text-button-icon">{iconRight}</span>
      )}
    </Component>
  );
}
