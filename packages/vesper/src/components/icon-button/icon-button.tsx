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
    /** The size of the button. Affects padding and font size. @default "lg" */
    size?: ButtonSize;
    /** The visual style variant of the button. @default "primary" */
    variant?: ButtonVariant;
    /** When true, renders the button in a disabled state and prevents interaction. */
    disabled?: boolean;
    /** The icon element to be rendered inside the button. */
    icon: ReactNode;
  },
  E,
  "children"
>;

/**
 * A button that renders a single icon without text. Built on top of the `Button` component.
 *
 * Be sure to always provide an accessible aria-label for users that rely on assistive technology.
 *
 * @example
 * <IconButton
 *   icon={<Close />}
 *   aria-label="Close"
 *   variant="subtle"
 *   size="sm"
 *   onClick={handleClose}
 * />
 *
 * @example
 * // Polymorphic usage as a link
 * <IconButton
 *   as="a"
 *   href="/settings"
 *   icon={<SettingsIcon />}
 *   aria-label="Settings"
 * />
 */
export function IconButton<E extends ElementType = "button">({
  icon,
  className,
  ...props
}: IconButtonProps<E>) {
  return (
    <Button
      iconLeft={icon}
      className={cn("vesper-icon-button", className)}
      {...(props as ButtonProps<E>)}
    />
  );
}
