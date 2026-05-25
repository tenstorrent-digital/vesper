import type { ComponentProps } from "react";
import { registry } from "./registry";

export type IconKind = keyof typeof registry;

export interface IconProps extends ComponentProps<"svg"> {
  kind: IconKind;
}

export function Icon({ kind, ...props }: IconProps) {
  const Component = registry[kind];
  if (!Component) return null;

  return <Component {...props} />;
}
