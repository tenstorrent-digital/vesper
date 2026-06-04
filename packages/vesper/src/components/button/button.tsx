import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

export type ButtonProps<E extends ElementType = "button"> = Polymorphic<
  {
    size: "lg" | "md" | "sm" | "xs";
    variant:
      | "primary"
      | "contrast"
      | "subtle"
      | "tertiary"
      | "ghost"
      | "danger"
      | "warning";
    disabled?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    className?: string;
  },
  E
>;

export function Button<E extends ElementType = "button">(
  props: ButtonProps<E>,
) {
  const {
    as: Component = "button",
    size,
    variant,
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
