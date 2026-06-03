import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

type BaseButtonProps = {
  size: "lg" | "md" | "sm" | "xs";
  variant:
    | "primary"
    | "contrast"
    | "subtle"
    | "tertiary"
    | "ghost"
    | "danger"
    | "warning"
    | "disabled";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export type ButtonProps<E extends ElementType = "button"> = Polymorphic<
  BaseButtonProps & { className?: string },
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
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-button",
        `vesper-button-${size}`,
        `vesper-button-${variant}`,
        className,
      )}
      {...rest}
    >
      {iconLeft && <span className="vesper-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-button-icon">{iconRight}</span>}
    </Component>
  );
}
