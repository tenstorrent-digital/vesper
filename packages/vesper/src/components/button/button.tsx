import { cn } from "@/utils/cn";
import type { ComponentProps, ReactNode } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
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
}

export function Button({
  size,
  variant,
  iconLeft,
  iconRight,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        `vesper-button-${size}`,
        `vesper-button-${variant}`,
        className,
      )}
      {...props}
    >
      {iconLeft && <span className="vesper-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && <span className="vesper-button-icon">{iconRight}</span>}
    </button>
  );
}
