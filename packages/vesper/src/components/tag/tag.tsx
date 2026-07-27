import type { ElementType, ReactNode } from "react";

import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
import type { Polymorphic } from "@/utils/polymorphic";

export const TAG_SIZES = ["sm", "md", "lg"] as const;

export const TAG_VARIANTS = [
  "default",
  "contrast",
  "accent-bold",
  "accent-subtle",
  "danger-bold",
  "danger-subtle",
  "success-bold",
  "success-subtle",
  "info-bold",
  "info-subtle",
  "warning-bold",
  "warning-subtle",
] as const;

export type TagSize = (typeof TAG_SIZES)[number];

export type TagVariant = (typeof TAG_VARIANTS)[number];

export type TagProps<E extends ElementType = "div"> = Polymorphic<
  {
    /** The size of the tag. Affects padding and font size. @default lg */
    size?: TagSize;
    /** The color variant of the tag. @defaults default */
    variant?: TagVariant;
    /** When `true`, renders the tag in a disabled state and prevents interaction. @default false */
    disabled?: boolean;
    /** An optional icon element rendered to the left of the tag text. */
    icon?: ReactNode;
  },
  E
>;

/**
 * A polymorphic label component for categorizing content with color variants and optional icons.
 *
 * Unlike `Badge` (which describes adjacent content like plan tiers or roles) and `Chip` (which displays on/off states), `Tags` are used to classify and organize content into categories.
 *
 * @see packages/vesper/src/components/badge/badge.tsx
 * @see packages/vesper/src/components/chip/chip.tsx
 *
 * @param {TagSize} [props.size] - (optional) The size of the tag. @default lg
 * @param {TagVariant} [props.variant] - (optional) The color variant of the tag. @default default
 * @param {boolean} [props.disabled] - (optional) Renders the tag in a disabled state
 * @param {ReactNode} [props.icon] - (optional) An icon element rendered to the left of the tag text
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default div
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <Tag variant="success-bold">Active</Tag>
 *
 * @example
 * <Tag size="sm" variant="danger-subtle" icon={<ErrorSolid />}>
 *   Failed
 * </Tag>
 */
export function Tag<E extends ElementType = "div">(props: TagProps<E>) {
  const {
    as: Component = "div",
    className,
    size = "lg",
    variant = "default",
    disabled,
    icon,
    children,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-tag",
        `vesper-tag-${size}`,
        disabled ? "vesper-tag-disabled" : `vesper-tag-${variant}`,
        className,
      )}
      {...rest}
      {...getDisabledProps(Component, !!disabled)}
    >
      {icon && <span className="vesper-tag-icon">{icon}</span>}
      <Typography as="span" variant="label-xs">
        {children}
      </Typography>
    </Component>
  );
}
