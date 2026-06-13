import type { ElementType } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

export const TYPOGRAPHY_VARIANTS = [
  "display-lg",
  "display-md",
  "display-sm",
  "heading-2xl",
  "heading-xl",
  "heading-lg",
  "heading-md",
  "heading-sm",
  "heading-xs",
  "copy-xl",
  "copy-xl-bold",
  "copy-lg",
  "copy-lg-bold",
  "copy-md",
  "copy-md-bold",
  "copy-sm",
  "copy-sm-bold",
  "copy-xs",
  "copy-xs-bold",
  "copy-xs-mono",
  "label-lg",
  "label-lg-bold",
  "label-md",
  "label-md-bold",
  "label-md-mono",
  "label-sm",
  "label-sm-bold",
  "label-sm-mono",
  "label-xs",
  "label-xs-bold",
  "label-xs-mono",
] as const;

export type TypographyVariant = (typeof TYPOGRAPHY_VARIANTS)[number];

export type TypographyProps<E extends ElementType = "p"> = Polymorphic<
  { variant?: TypographyVariant },
  E
>;

export function Typography<E extends ElementType = "p">(
  props: TypographyProps<E>,
) {
  const {
    as: Component = "p",
    className,
    variant = "copy-sm",
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-typography",
        `vesper-typography-${variant}`,
        className,
      )}
      {...rest}
    />
  );
}
