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
