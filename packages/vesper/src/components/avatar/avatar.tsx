import { cn } from "@/utils/cn";
import type { ComponentProps } from "react";

export interface AvatarProps extends ComponentProps<"img"> {
  size: "lg" | "md" | "sm";
}

export function Avatar({ size, className, ...props }: AvatarProps) {
  return (
    <img
      className={cn("vesper-avatar", `vesper-avatar-${size}`, className)}
      {...props}
    />
  );
}
