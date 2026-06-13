import type { ElementType, ReactNode } from "react";
import {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/button/button";
import { Polymorphic } from "@/utils/polymorphic";

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
  ...props
}: IconButtonProps<E>) {
  return <Button iconLeft={icon} {...(props as ButtonProps<E>)} />;
}
