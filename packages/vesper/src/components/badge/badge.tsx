import type { ElementType, ReactNode } from "react";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const BADGE_SIZES = ["sm", "md", "lg"] as const;

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

export type BadgeSize = (typeof BADGE_SIZES)[number];

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export type BadgeProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size of the badge. Affects padding and typography. @default lg */
    size?: BadgeSize;
    /** The color variant of the badge. @default accent */
    variant?: BadgeVariant;
    /** When true, renders the badge with a more subdued, subtle appearance. @default false */
    subtle?: boolean;
    /** An optional icon element rendered to the left of the badge text. */
    icon?: ReactNode;
  },
  E
>;

const BADGE_TYPOGRAPHY_VARIANTS: { [S in BadgeSize]: TypographyVariant } = {
  lg: "label-md",
  md: "label-sm",
  sm: "label-xs",
};

/**
 * A polymorphic badge component for highlighting status, categories, or counts with color variants and optional icons.
 *
 * @param {BadgeSize} [props.size] - (optional) The size of the badge. @default lg
 * @param {BadgeVariant} [props.variant] - (optional) The color variant of the badge. @default accent
 * @param {boolean} [props.subtle] - (optional) Renders the badge with a more subdued appearance. @default false
 * @param {ReactNode} [props.icon] - (optional) An icon element rendered to the left of the badge text
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default div
 *
 * @example
 * <Badge variant="success">Active</Badge>
 *
 * @example
 * <Badge size="sm" variant="danger" icon={<ErrorSolid />} subtle>
 *   3 errors
 * </Badge>
 */
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
        variant={BADGE_TYPOGRAPHY_VARIANTS[size]}
        className="vesper-badge-text"
      >
        {children}
      </Typography>
    </Component>
  );
}
