import { cn } from "@/utils/cn";
import type { ComponentProps, ReactNode } from "react";

export interface TextButtonProps extends ComponentProps<"button"> {
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
}

export function TextButton({
  size,
  variant,
  iconLeft,
  iconRight,
  children,
  ...props
}: TextButtonProps) {
  return (
    <button
      className={cn(
        `vesper-text-button-${size}`,
        `vesper-text-button-${variant}`,
      )}
      {...props}
    >
      {iconLeft && <span className="vesper-text-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && (
        <span className="vesper-text-button-icon">{iconRight}</span>
      )}
    </button>
  );
}
