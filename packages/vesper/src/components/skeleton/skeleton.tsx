import { useId, type ComponentProps } from "react";
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
      className={cn("vesper-skeleton", className)}
      style={{
        width: size ?? width,
        height: size ?? height,
        ...style,
      }}
      {...props}
    >
      {children}
      <SkeletonOverlay shape={shape} />
    </div>
  );
}

function SkeletonOverlay({ shape }: { shape: SkeletonShape }) {
  const maskId = useId();

  const rx =
    shape === "box"
      ? "var(--vesper-radius-1)"
      : shape === "circle"
        ? "50%"
        : undefined;

  const ry = shape === "pill" ? "50%" : undefined;

  return (
    <div
      className="vesper-skeleton-overlay"
      style={{ maskImage: `url(#${CSS.escape(maskId)})` }}
    >
      <svg aria-hidden width="100%" height="100%">
        <defs>
          <mask id={maskId} maskContentUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="#fff" rx={rx} ry={ry} />
          </mask>
        </defs>
      </svg>
    </div>
  );
}
