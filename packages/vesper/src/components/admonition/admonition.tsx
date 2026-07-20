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
    /** The size of the admonition. Affects padding and typography. Defaults to `"sm"`. */
    size?: AdmonitionSize;
    /** The visual variant of the admonition, which determines its color scheme and icon. Default to `"info"`. */
    variant?: AdmonitionVariant;
    /** When `true`, renders the admonition with a more subdued, subtle appearance. */
    subtle?: boolean;
    /**
     * Props passed to the optional call-to-action button rendered alongside the admonition content.
     *
     * The presence of this prop will render a small constrast-themed button to the right of the admonition content.
     */
    cta?: Omit<ButtonProps<C>, "size" | "variant" | "as">;
    /** Sets the `ElementType` the cta will render as. Defaults to `"button"`. */
    ctaAs?: C;
  },
  E
>;

const ADMONITION_TYPOGRAPHY_VARIANTS: {
  [S in AdmonitionSize]: TypographyVariant;
} = {
  md: "copy-sm",
  sm: "copy-xs",
};

/**
 * A callout component for displaying contextual messages with variant-specific icons and colors.
 * Optionally includes a call-to-action button.
 *
 * @example
 * <Admonition variant="warning" size="md">
 *   This feature is experimental and subject to breaking changes.
 * </Admonition>
 *
 * @example
 * // With a call-to-action button
 * <Admonition variant="danger" cta={{ children: "Confirm", onClick: handleConfirm }}>
 *   The changes you are about to make are irreversible.
 * </Admonition>
 *
 * @example
 * // Call-to-action button polymorphism
 * <Admonition
 *   variant="info"
 *   ctaAs="a"
 *   cta={{
 *      children: "Settings",
 *      href: '/settings'
 *    }}
 *  >
 *   You can see the full set of options in app settings.
 * </Admonition>
 */
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
          type="button"
          {...(cta as ButtonProps<E>)}
          as={ctaAs}
          variant="contrast"
          size="sm"
        />
      )}
    </Component>
  );
}
