import type { ElementType, ReactNode } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

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
    size?: TagSize;
    variant?: TagVariant;
    disabled?: boolean;
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
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "vesper-tag",
        `vesper-tag-${size}`,
        `vesper-tag-${variant}`,
        disabled && "vesper-tag-disabled",
        className,
      )}
      {...rest}
    >
      {icon && <span className="vesper-tag-icon">{icon}</span>}
      {children}
    </Component>
  );
}
