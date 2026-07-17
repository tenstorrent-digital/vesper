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
    size?: ButtonSize;
    variant?: ButtonVariant;
    icon: ReactNode;
    disabled?: boolean;
  },
  E,
  "children"
>;

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
