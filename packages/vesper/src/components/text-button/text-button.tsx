import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

type BaseButtonProps = {
  size: "lg" | "md" | "sm";
  variant:
    | "subtle"
    | "contrast"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "purple"
    | "pink"
    | "disabled";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export type TextButtonProps<E extends ElementType = "button"> = Polymorphic<
  BaseButtonProps & { className?: string },
  E
>;

export function TextButton<E extends ElementType>(props: TextButtonProps<E>) {
  const {
    as: Component = "button",
    size,
    variant,
    iconLeft,
    iconRight,
    children,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        `vesper-text-button-${size}`,
        `vesper-text-button-${variant}`,
      )}
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
