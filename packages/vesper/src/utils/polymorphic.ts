import type { ComponentProps, ElementType } from "react";

/**
 * Helper generic to create prop type signatures for polymorphic components. Takes 2-3 arguments:
 *
 * `P`: props that belong to the polymorphic component, eg:
 * ```ts
 * { variant: "primary" | "secondary" }
 * ```
 *
 * `E`: the element that the polymorphic component extends, eg:
 * ```ts
 * "button"
 * ```
 *
 * `O`: any additional props to omit from the element the polymorphic component extends, eg:
 * ```ts
 * "children" | "onClick"
 * ```
 *
 * Usage:
 * ```tsx
 * type MyComponentProps<E extends ElementType = "div"> = Polymorphic<
 *   { variant: "primary" | "secondary" },
 *   E,
 *   "children"
 * >
 *
 * const MyComponent<E extends ElementType = "div">(
 *   props: MyComponentProps<E>
 * ) {
 *   const { as: Component = "div", variant, ...rest } = props
 *
 *   return <Component {...rest} />
 * }
 * ```
 */
export type Polymorphic<
  P,
  E extends ElementType,
  O extends never | string | number | symbol = never,
> = P & {
  as?: E;
} & Omit<
    ComponentProps<E>,
    O extends never ? keyof P | "as" : keyof P | "as" | O
  >;
