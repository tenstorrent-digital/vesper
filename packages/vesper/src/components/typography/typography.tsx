import type { ElementType } from "react";
import type { Polymorphic } from "@/utils/polymorphic";
import { cn } from "@/utils/cn";

type DisplayVariantPermutations = {
  variant: "display";
  size: "lg" | "md" | "sm";
  bold?: never;
  mono?: never;
};

type HeadingVariantPermutations = {
  variant: "heading";
  size: "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  bold?: never;
  mono?: never;
};

type CopyVariantPermutations =
  | {
      variant: "copy";
      size: "xl" | "lg" | "md" | "sm" | "xs";
      mono?: never;
      bold?: boolean;
    }
  | {
      variant: "copy";
      size: "xs";
      mono?: true;
      bold?: never;
    };

type LabelVariantPermutations =
  | {
      variant: "label";
      size: "lg" | "md" | "sm" | "xs";
      bold?: boolean;
      mono?: never;
    }
  | {
      variant: "label";
      size: "md" | "sm" | "xs";
      bold?: never;
      mono?: true;
    };

type TypographyVariantPermutations =
  | DisplayVariantPermutations
  | HeadingVariantPermutations
  | CopyVariantPermutations
  | LabelVariantPermutations;

export type TypographyProps<E extends ElementType = "p"> = Polymorphic<
  TypographyVariantPermutations & { className?: string },
  E
>;

export function Typography<E extends ElementType = "p">(
  props: TypographyProps<E>,
) {
  const {
    as: Component = "p",
    className,
    size,
    variant,
    bold,
    mono,
    ...rest
  } = props;

  const permutation = {
    variant,
    size,
    mono,
    bold,
  } as TypographyVariantPermutations;

  let permutationClassName = `vesper-typography-${permutation.variant}-${permutation.size}`;
  if (permutation.bold) permutationClassName += "-bold";
  if (permutation.mono) permutationClassName += "-mono";

  return (
    <Component
      className={cn("vesper-typography", permutationClassName, className)}
      {...rest}
    />
  );
}
