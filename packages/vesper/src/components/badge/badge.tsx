import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";
import { Typography } from "@/components/typography/typography";

export const BADGE_SIZES = ["lg", "md", "sm"] as const;

export const BADGE_VARIANTS = [
  "accent",
  "success",
  "warning",
  "danger",
  "info",
  "purple",
  "pink",
  "mint",
  "contrast",
] as const;

export type BadgeType = (typeof BADGE_SIZES)[number];

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export type BadgeProps<E extends ElementType = "div"> = Polymorphic<
  {
    size?: BadgeType;
    variant?: BadgeVariant;
    subtle?: boolean;
    icon?: ReactNode;
  },
  E
>;

const BADGE_TYPOGRAPHY_SIZES = {
  lg: "md",
  md: "sm",
  sm: "xs",
} as const;

export function Badge<E extends ElementType = "div">(props: BadgeProps<E>) {
  const {
    as: Component = "div",
    className,
    size = "lg",
    variant = "accent",
    subtle,
    icon,
    children,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-badge",
        `vesper-badge-${size}`,
        subtle ? `vesper-badge-${variant}-subtle` : `vesper-badge-${variant}`,
        className,
      )}
      {...rest}
    >
      {icon && <span className="vesper-badge-icon">{icon}</span>}
      <Typography
        as="span"
        variant="label"
        size={BADGE_TYPOGRAPHY_SIZES[size]}
        className="vesper-badge-text"
      >
        {children}
      </Typography>
    </Component>
  );
}
