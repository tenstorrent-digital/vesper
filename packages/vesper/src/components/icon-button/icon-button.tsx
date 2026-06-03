import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/button/button";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "iconLeft" | "iconRight"
> {
  icon: ReactNode;
}

export function IconButton({ icon, ...props }: IconButtonProps) {
  return <Button iconLeft={icon} {...props} />;
}
