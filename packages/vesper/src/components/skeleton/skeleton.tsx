import { useEffect, useState, type ComponentProps } from "react";
import { cn } from "@/utils/cn";

export const SKELETON_SHAPES = ["box", "pill", "circle"] as const;

export type SkeletonShape = (typeof SKELETON_SHAPES)[number];

export interface SkeletonProps extends ComponentProps<"div"> {
  shape?: SkeletonShape;
  size?: number;
  width?: number;
  height?: number;
  show?: boolean;
}

export function Skeleton({
  className,
  shape = "box",
  width,
  height,
  size,
  show,
  children,
  style,
  ...props
}: SkeletonProps) {
  const [didAnimateOut, setDidAnimateOut] = useState(!show);
  useEffect(() => {
    if (show) setDidAnimateOut(false);
  }, [show]);

  if (didAnimateOut) return children;

  return (
    <div
      onAnimationEnd={(e) =>
        setDidAnimateOut(e.animationName === "vesper-skeleton-fade")
      }
      className={cn(
        "vesper-skeleton",
        `vesper-skeleton-${shape}`,
        !show && "vesper-skeleton-hidden",
        className,
      )}
      style={{ width: size ?? width, height: size ?? height, ...style }}
      {...props}
    >
      {children}
      <svg
        aria-hidden
        className={cn(
          "vesper-skeleton-overlay",
          `vesper-skeleton-overlay-${shape}`,
        )}
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={
            shape === "box"
              ? "var(--vesper-radius-1)"
              : shape === "circle"
                ? "50%"
                : undefined
          }
          ry={shape === "pill" ? "50%" : undefined}
          fill="var(--vesper-stone-300)"
        />
      </svg>
    </div>
  );
}
