import type { ComponentProps } from "react";

import { cn } from "@/utils/cn";

export const SKELETON_SHAPES = ["box", "pill", "circle"] as const;

export type SkeletonShape = (typeof SKELETON_SHAPES)[number];

export interface SkeletonProps extends ComponentProps<"div"> {
  /** The shape of the skeleton placeholder. @default box */
  shape?: SkeletonShape;
  /** Sets both the `width` and `height` of the skeleton simultaneously. Accepts a number (interpreted as pixels) or a CSS string value. Overrides individual `width` and `height` props. */
  size?: number | string;
  /** The `width` of the skeleton. Accepts a number (interpreted as pixels) or a CSS string value. */
  width?: number | string;
  /** The `height` of the skeleton. Accepts a number (interpreted as pixels) or a CSS string value. */
  height?: number | string;
  /** When `true`, renders the skeleton overlay. When `false`, renders only the children without the skeleton. @default true */
  show?: boolean;
}

/**
 * A placeholder loading element that displays an animated shimmer overlay in configurable shapes and sizes.
 *
 * @param {SkeletonShape} [props.shape] - (optional) The shape of the skeleton placeholder. @default box
 * @param {number | string} [props.size] - (optional) Sets both width and height simultaneously
 * @param {number | string} [props.width] - (optional) The width of the skeleton
 * @param {number | string} [props.height] - (optional) The height of the skeleton
 * @param {boolean} [props.show] - (optional) Whether to render the skeleton overlay. @default true
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Skeleton width={200} height={20} />
 *
 * @example
 * <Skeleton shape="circle" size={48} />
 *
 * @example
 * <Skeleton show={isLoading}>
 *   <Avatar src={user.avatar} />
 * </Skeleton>
 */
export function Skeleton(props: SkeletonProps) {
  const {
    className,
    shape = "box",
    width,
    height,
    size,
    show = true,
    children,
    style,
    ...rest
  } = props;

  if (!show) return children;

  return (
    <div
      className={cn("vesper-skeleton", `vesper-skeleton-${shape}`, className)}
      style={{
        width: size ?? width,
        height: size ?? height,
        ...style,
      }}
      {...rest}
    >
      {children}
      <div className="vesper-skeleton-overlay" />
    </div>
  );
}
