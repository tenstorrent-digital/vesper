import type { ElementType, ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/button/button";

export type IconButtonProps<E extends ElementType = "button"> = Omit<
  ButtonProps<E>,
  "children" | "iconLeft" | "iconRight"
> & {
  icon: ReactNode;
};

export function IconButton<E extends ElementType = "button">({
  icon,
  ...props
}: IconButtonProps<E>) {
  return <Button iconLeft={icon} {...(props as ButtonProps<E>)} />;
}
