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
  variant?: Exclude<MaterialVariant, "interactive">;
  state?: never;
};

type InteractiveMaterialProps = {
  variant: Extract<MaterialVariant, "interactive">;
  state?: InteractiveMaterialState;
};

type BaseMaterialProps = NonInteractiveMaterialProps | InteractiveMaterialProps;

export type MaterialProps<E extends ElementType = "div"> = Polymorphic<
  BaseMaterialProps,
  E
>;

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
