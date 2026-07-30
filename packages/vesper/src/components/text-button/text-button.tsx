import type { ElementType, ReactNode } from "react";

import { cn } from "@/utils/cn";
import { getDisabledProps } from "@/utils/getDisabledProps";
import type { Polymorphic } from "@/utils/polymorphic";

export const TEXT_BUTTON_SIZES = ["sm", "md", "lg"] as const;

export const TEXT_BUTTON_VARIANTS = [
  "subtle",
  "contrast",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
  "purple",
  "pink",
] as const;

export type TextButtonSize = (typeof TEXT_BUTTON_SIZES)[number];

export type TextButtonVariant = (typeof TEXT_BUTTON_VARIANTS)[number];

export type TextButtonProps<E extends ElementType = "button"> = Polymorphic<
  {
    /** The size of the text button. Affects font size. @default md */
    size?: TextButtonSize;
    /** The color variant of the text button. @default accent */
    variant?: TextButtonVariant;
    /** When `true`, renders the text button in a disabled state and prevents interaction. @default false */
    disabled?: boolean;
    /** An optional icon element rendered to the left of the text button content. */
    iconLeft?: ReactNode;
    /** An optional icon element rendered to the right of the text button content. */
    iconRight?: ReactNode;
  },
  E
>;

/**
 * A polymorphic text-only button component with color variants and optional leading/trailing icons, rendered without a background.
 *
 * Unlike `Button` (which renders with a filled or outlined background), `IconButton` (which displays a single icon without text), and `SplitButton` (which pairs a primary action with a dropdown menu), `TextButton` provides a minimal, text-styled control.
 *
 * @see packages/vesper/src/components/button/button.tsx
 * @see packages/vesper/src/components/icon-button/icon-button.tsx
 * @see packages/vesper/src/components/split-button/split-button.tsx
 *
 * @param {TextButtonSize} [props.size] - (optional) The size of the text button. @default md
 * @param {TextButtonVariant} [props.variant] - (optional) The color variant. @default accent
 * @param {boolean} [props.disabled] - (optional) Renders the button in a disabled state. @default false
 * @param {ReactNode} [props.iconLeft] - (optional) An icon rendered to the left of the content
 * @param {ReactNode} [props.iconRight] - (optional) An icon rendered to the right of the content
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default button
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <TextButton onClick={handleClick}>Learn more</TextButton>
 *
 * @example
 * <TextButton variant="danger" iconRight={<ArrowRight />} as="a" href="/docs">
 *   View documentation
 * </TextButton>
 */
export function TextButton<E extends ElementType>(props: TextButtonProps<E>) {
  const {
    as: Component = "button",
    size = "md",
    variant = "accent",
    iconLeft,
    iconRight,
    children,
    className,
    disabled,
    ...rest
  } = props;

  return (
    <Component
      className={cn(
        "vesper-text-button",
        `vesper-text-button-${size}`,
        `vesper-text-button-${disabled ? "disabled" : variant}`,
        className,
      )}
      {...rest}
      {...getDisabledProps(Component, !!disabled)}
    >
      {iconLeft && <span className="vesper-text-button-icon">{iconLeft}</span>}
      {children}
      {iconRight && (
        <span className="vesper-text-button-icon">{iconRight}</span>
      )}
    </Component>
  );
}
