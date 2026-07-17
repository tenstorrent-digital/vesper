import type { ElementType } from "react";

import { Button, ButtonProps } from "@/components/button/button";
import {
  ErrorSolid,
  Info,
  InfoSolid,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { Polymorphic } from "@/utils/polymorphic";

export const ADMONITION_SIZES = ["sm", "md"] as const;

export const ADMONITION_VARIANTS = [
  "info",
  "success",
  "warning",
  "danger",
  "secondary",
] as const;

export type AdmonitionSize = (typeof ADMONITION_SIZES)[number];

export type AdmonitionVariant = (typeof ADMONITION_VARIANTS)[number];

export type AdmonitionProps<
  E extends ElementType = "div",
  C extends ElementType = "button",
> = Polymorphic<
  {
    size?: AdmonitionSize;
    variant?: AdmonitionVariant;
    subtle?: boolean;
    ctaAs?: C;
    cta?: Omit<ButtonProps<C>, "size" | "variant" | "as">;
  },
  E
>;

const ADMONITION_TYPOGRAPHY_VARIANTS: {
  [S in AdmonitionSize]: TypographyVariant;
} = {
  md: "copy-sm",
  sm: "copy-xs",
};

export function Admonition<
  E extends ElementType = "div",
  C extends ElementType = "button",
>(props: AdmonitionProps<E, C>) {
  const {
    as: Component = "div",
    className,
    size = "sm",
    variant = "info",
    ctaAs,
    cta,
    children,
    subtle,
    ...rest
  } = props;
  return (
    <Component
      className={cn(
        "vesper-admonition",
        `vesper-admonition-${size}`,
        `vesper-admonition-${variant}`,
        subtle && "vesper-admonition-subtle",
        className,
      )}
      {...rest}
    >
      <div className="vesper-admonition-content">
        <span className="vesper-admonition-icon">
          {variant === "danger" && <ErrorSolid />}
          {variant === "info" && <InfoSolid />}
          {variant === "secondary" && <Info />}
          {variant === "success" && <SuccessSolid />}
          {variant === "warning" && <WarningSolid />}
        </span>
        <Typography as="span" variant={ADMONITION_TYPOGRAPHY_VARIANTS[size]}>
          {children}
        </Typography>
      </div>
      {cta && (
        <Button
          {...(cta as ButtonProps<E>)}
          as={ctaAs}
          variant="contrast"
          size="sm"
        />
      )}
    </Component>
  );
}
