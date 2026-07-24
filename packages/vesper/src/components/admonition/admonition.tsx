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
    /** The size of the admonition. Affects padding and typography. @default sm */
    size?: AdmonitionSize;
    /** The visual variant of the admonition, which determines its color scheme and icon. @default info */
    variant?: AdmonitionVariant;
    /** When `true`, renders the admonition with a more subdued, subtle appearance. @default false */
    subtle?: boolean;
    /**
     * Props passed to the optional call-to-action button rendered alongside the admonition content.
     *
     * The presence of this prop will render a small contrast-themed button to the right of the admonition content.
     */
    cta?: Omit<ButtonProps<C>, "size" | "variant" | "as">;
    /** Sets the `ElementType` the cta will render as. @default button */
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
 * A polymorphic callout component for displaying informational, success, warning, or error messages with an optional call-to-action button.
 *
 * @param {AdmonitionVariant} [props.variant] - (optional) The visual variant determining color and icon. @default info
 * @param {AdmonitionSize} [props.size] - (optional) The size of the admonition. @default sm
 * @param {boolean} [props.subtle] - (optional) Renders the admonition with a more subdued appearance
 * @param {ButtonProps} [props.cta] - (optional) Props for an action button rendered alongside the content
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default div
 *
 * You may also pass any additional props to the underlying element.
 *
 * @example
 * <Admonition variant="warning">
 *   Your session will expire in 5 minutes.
 * </Admonition>
 *
 * @example
 * <Admonition
 *   variant="danger"
 *   size="md"
 *   cta={{ children: "Retry", onClick: handleRetry }}
 * >
 *   Failed to save changes.
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
