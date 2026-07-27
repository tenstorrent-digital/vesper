import type { ElementType, ReactNode } from "react";

import {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/button/button";

import { cn } from "@/utils/cn";
import type { Polymorphic } from "@/utils/polymorphic";

export type IconButtonProps<E extends ElementType = "button"> = Polymorphic<
  {
    /** The size of the button. Affects padding and font size. @default lg */
    size?: ButtonSize;
    /** The visual style variant of the button. @default primary */
    variant?: ButtonVariant;
    /** When true, renders the button in a disabled state and prevents interaction. @default false */
    disabled?: boolean;
    /** The icon element to be rendered inside the button. */
    icon: ReactNode;
  },
  E,
  "children"
>;

/**
 * A polymorphic icon-only button component that wraps the Button with a single icon and no text content.
 *
 * @param {ReactNode} props.icon - The icon element rendered inside the button
 * @param {ButtonSize} [props.size] - (optional) The size of the button. @default lg
 * @param {ButtonVariant} [props.variant] - (optional) The visual style variant. @default primary
 * @param {boolean} [props.disabled] - (optional) Renders the button in a disabled state. @default false
 * @param {React.ElementType} [props.as] - (optional) Element type to render. @default button
 *
 * You may also pass any additional props to the underlying element
 *
 * @example
 * <IconButton icon={<Close />} aria-label="Close" onClick={handleClose} />
 *
 * @example
 * <IconButton icon={<Gear />} variant="ghost" size="sm" aria-label="Settings" />
 */
export function IconButton<E extends ElementType = "button">(
  props: IconButtonProps<E>,
) {
  const { icon, className, ...rest } = props;

  return (
    <Button
      iconLeft={icon}
      className={cn("vesper-icon-button", className)}
      {...(rest as ButtonProps<E>)}
    />
  );
}
