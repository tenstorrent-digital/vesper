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
    /** The size of the tag. Affects padding and font size. Defaults to `"lg"`. */
    size?: TagSize;
    /** The color variant of the tag. Defaults to `"default"`. */
    variant?: TagVariant;
    /** When `true`, renders the tag in a disabled state and prevents interaction. */
    disabled?: boolean;
    /** An optional icon element rendered to the left of the tag text. */
    icon?: ReactNode;
  },
  E
>;

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
