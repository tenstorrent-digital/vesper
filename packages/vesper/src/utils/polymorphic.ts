import type { ComponentProps, ElementType } from "react";

/**
 * Helper generic to create prop type signatures for polymorphic components. Takes 3-4 arguments:
 *
 * `Props`: props that belong to the polymorphic component, eg:
 * ```ts
 * { variant: "primary" | "secondary" }
 * ```
 *
 * `As`: the element that the polymorphic component extends, eg:
 * ```ts
 * "button"
 * ```
 *
 * `Default`: the element the polymorphic component renders by default (must match the default of `E`), eg:
 * ```ts
 * "button"
 * ```
 *
 * `Omitted`: any additional props to omit from the element the polymorphic component extends, eg:
 * ```ts
 * "children" | "onClick"
 * ```
 *
 * Usage:
 * ```tsx
 * type MyComponentProps<E extends ElementType = "div"> = Polymorphic<
 *   { variant: "primary" | "secondary" },
 *   E,
 *   "div",
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
  Props,
  As extends ElementType,
  Default extends ElementType,
  Omitted extends PropertyKey = never,
> = Props & {
  /** The `ElementType` to render this component as, eg. `as="button"` */
  as?: As;
} & (ElementType extends As
    ? Omit<ComponentProps<Default>, keyof Props | "as" | Omitted>
    : Omit<ComponentProps<As>, keyof Props | "as" | Omitted>);
