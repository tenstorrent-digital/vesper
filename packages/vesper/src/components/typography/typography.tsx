import type { ElementType } from "react";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export const TYPOGRAPHY_VARIANTS = [
  "display-sm",
  "display-md",
  "display-lg",
  "heading-xs",
  "heading-sm",
  "heading-md",
  "heading-lg",
  "heading-xl",
  "heading-2xl",
  "copy-xs",
  "copy-xs-bold",
  "copy-xs-mono",
  "copy-sm",
  "copy-sm-bold",
  "copy-md",
  "copy-md-bold",
  "copy-lg",
  "copy-lg-bold",
  "copy-xl",
  "copy-xl-bold",
  "label-xs",
  "label-xs-bold",
  "label-xs-mono",
  "label-sm",
  "label-sm-bold",
  "label-sm-mono",
  "label-md",
  "label-md-bold",
  "label-md-mono",
  "label-lg",
  "label-lg-bold",
] as const;

export type TypographyVariant = (typeof TYPOGRAPHY_VARIANTS)[number];

export type TypographyProps<E extends ElementType = "p"> = Polymorphic<
  {
    /** The typographic style variant to apply, controlling font size, weight, line height, and font family. @default copy-md. */
    variant?: TypographyVariant;
  },
  E
>;

/**
 * A polymorphic component for rendering text with consistent typographic styles. It applies a predefined set of font size, weight, line height, and font family based on the selected `variant`, with options for:
 * - `display-*`
 * - `heading-*`
 * - `label-*`
 * - `copy-*`
 *
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default p
 * @param {TypographyVariant} [props.variant] - (optional) Text style variant to apply. See {@link TYPOGRAPHY_VARIANTS} for available options. @default copy-md
 * @param {string} [props.className] - (optional) Additional CSS `class` names to apply
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <Typography variant="heading-lg" as="h1">
 *   Welcome to Vesper
 * </Typography>
 *
 * @example
 * <Typography variant="copy-md">
 *   This is a paragraph of body text.
 * </Typography>
 */
export function Typography<E extends ElementType = "p">(
  props: TypographyProps<E>,
) {
  const {
    as: Component = "p",
    className,
    variant = "copy-md",
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
