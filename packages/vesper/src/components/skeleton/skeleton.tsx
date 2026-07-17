import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

export const SKELETON_SHAPES = ["box", "pill", "circle"] as const;

export type SkeletonShape = (typeof SKELETON_SHAPES)[number];

export interface SkeletonProps extends ComponentProps<"div"> {
  shape?: SkeletonShape;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  show?: boolean;
}

export function Skeleton({
  className,
  shape = "box",
  width,
  height,
  size,
  show = true,
  children,
  style,
  ...props
}: SkeletonProps) {
  if (!show) return children;

  return (
    <div
      className={cn("vesper-skeleton", `vesper-skeleton-${shape}`, className)}
      style={{
        width: size ?? width,
        height: size ?? height,
        ...style,
      }}
      {...props}
    >
      {children}
      <div className="vesper-skeleton-overlay" />
    </div>
  );
}
