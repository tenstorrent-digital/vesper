import type { ElementType } from "react";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
import { Polymorphic } from "@/utils/polymorphic";

export const BUTTON_SIZES = ["xs", "sm", "md", "lg"] as const;

export const MATERIAL_VARIANTS = [
  "outlined",
  "outlined-strong",
  "raised",
  "floating",
  "modal",
  "inset",
  "inset-strong",
  "interactive",
] as const;

export const INTERACTIVE_MATERIAL_STATES = [
  "disabled",
  "active",
  "selected",
] as const;

export type MaterialVariant = (typeof MATERIAL_VARIANTS)[number];

export type InteractiveMaterialState =
  (typeof INTERACTIVE_MATERIAL_STATES)[number];

type NonInteractiveMaterialProps = {
  /** The visual style variant of the material surface. Defaults to `"outlined"`. */
  variant?: Exclude<MaterialVariant, "interactive">;
  /** The current interaction state of the material surface. Only applicable when `variant` is `"interactive"`. */
  state?: never;
};

type InteractiveMaterialProps = {
  /** Must be set to `"interactive"` to enable interactive states such as active, selected, and disabled. */
  variant: Extract<MaterialVariant, "interactive">;
  /** The current interaction state of the material surface. Only applicable when `variant` is `"interactive"`. */
  state?: InteractiveMaterialState;
};

type BaseMaterialProps = NonInteractiveMaterialProps | InteractiveMaterialProps;

export type MaterialProps<E extends ElementType = "div"> = Polymorphic<
  BaseMaterialProps,
  E
>;

/**
 * A polymorphic surface component providing consistent elevation and border styles. Used as a building block for cards, panels, and interactive containers.
 *
 * Materials should be used to communicate containment, hierarchy, interactivity, and depth across the interface.
 *
 * @example
 * <Material variant="raised">
 *   <Typography>Card content</Typography>
 * </Material>
 *
 * @example
 * // Interactive material with state
 * <Material as="button" variant="interactive" state="selected">
 *   Selected item
 * </Material>
 */
export function Material<E extends ElementType = "div">(
  props: MaterialProps<E>,
) {
  const {
    as: Component = "div",
    className,
    variant = "outlined",
    state,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-material",
        `vesper-material-${variant}`,
        variant === "interactive" && state && `vesper-material-${state}`,
        className,
      )}
      {...rest}
      {...getDisabledProps(Component, state === "disabled")}
    />
  );
}
