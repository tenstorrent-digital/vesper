import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

export const SKELETON_SHAPES = ["box", "pill", "circle"] as const;

export type SkeletonShape = (typeof SKELETON_SHAPES)[number];

export interface SkeletonProps extends ComponentProps<"div"> {
  /** The shape of the skeleton placeholder. Defaults to `"box"`. */
  shape?: SkeletonShape;
  /** Sets both the `width` and `height` of the skeleton simultaneously. Accepts a number (interpreted as pixels) or a CSS string value. Overrides individual `width` and `height` props. */
  size?: number | string;
  /** The `width` of the skeleton. Accepts a number (interpreted as pixels) or a CSS string value. */
  width?: number | string;
  /** The `height` of the skeleton. Accepts a number (interpreted as pixels) or a CSS string value. */
  height?: number | string;
  /** When `true`, renders the skeleton overlay. When `false`, renders only the children without the skeleton. Defaults to `true`. */
  show?: boolean;
}

/**
 * A placeholder loading indicator that mimics the shape of content while it loads.
 * When `show` is false, renders only its children without the skeleton overlay.
 *
 * @example
 * <Skeleton width={200} height={20} />
 *
 * @example
 * // Circle avatar skeleton
 * <Skeleton shape="circle" size={48} />
 *
 * @example
 * // Conditional skeleton wrapping content
 * <Skeleton show={isLoading} width={120} height={16}>
 *   <span>{userName}</span>
 * </Skeleton>
 *
 * @example
 * // As a Suspense fallback
 * <Suspense fallback={<Skeleton width={200} height={40} shape="pill" />}>
 *   <AsyncContent />
 * </Suspense>
 */
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
