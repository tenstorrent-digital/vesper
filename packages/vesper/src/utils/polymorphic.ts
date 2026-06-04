import type { ComponentProps, ElementType } from "react";

export type Polymorphic<P, E extends ElementType> = P & {
  as?: E;
} & Omit<ComponentProps<E>, keyof P | "as">;
