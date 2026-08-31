import type { AriaAttributes, ComponentProps, ElementType } from "react";

/**
 * These props may not be forwarded at all. `role` should not be overridden for
 * accessibility reasons, while `children` and `dangerouslySetInnerHTML` should
 * not be allowed as each of our form input components render their own content
 * */
const DISALLOWED_PROPS = [
  "role",
  "children",
  "dangerouslySetInnerHTML",
] as const satisfies (keyof ComponentProps<"div">)[];

/**
 * Props which get forwarded to the underlying control element. Typically the
 * underlying control will be a `button`, `input`, or `textarea` element.
 *
 * Other event handlers are omitted so they may be forwarded to wrappers.
 * */
const CONTROL_PROPS = [
  // base set of props
  "autoCapitalize",
  "autoCorrect",
  "autoFocus",
  "enterKeyHint",
  "id",
  "inputMode",
  "ref",
  "spellCheck",
  "tabIndex",
  "title",
  // focus
  "onBlur",
  "onBlurCapture",
  "onFocus",
  "onFocusCapture",
  // keyboard
  "onKeyDown",
  "onKeyDownCapture",
  "onKeyPress",
  "onKeyPressCapture",
  "onKeyUp",
  "onKeyUpCapture",
  // input and value
  "onBeforeInput",
  "onBeforeInputCapture",
  "onChange",
  "onChangeCapture",
  "onInput",
  "onInputCapture",
  "onInvalid",
  "onInvalidCapture",
  "onSelect",
  "onSelectCapture",
  // clipboard
  "onCopy",
  "onCopyCapture",
  "onCut",
  "onCutCapture",
  "onPaste",
  "onPasteCapture",
  // composition, for input method editors
  "onCompositionEnd",
  "onCompositionEndCapture",
  "onCompositionStart",
  "onCompositionStartCapture",
  "onCompositionUpdate",
  "onCompositionUpdateCapture",
  // the control is the element that overflows, never the wrapper
  "onScroll",
  "onScrollCapture",
  "onScrollEnd",
  "onScrollEndCapture",
  "onWheel",
  "onWheelCapture",
] as const satisfies (keyof ComponentProps<"div">)[];

/** List of all aria attributes */
const ARIA_PROPS = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-braillelabel",
  "aria-brailleroledescription",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
] as const satisfies (keyof AriaAttributes)[];

type AssertNever<T extends never> = T;

/** This will cause builds to fail if the ARIA_PROPS list does not contain all aria-attributes */
export type AssertAllAriaAttributesAccountedFor = AssertNever<
  Exclude<keyof AriaAttributes, (typeof ARIA_PROPS)[number]>
>;

/** Form-related props for when the underlying control is a `button` */
const BUTTON_FORM_PROPS = [
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "value",
] as const satisfies (keyof ComponentProps<"button">)[];

/** Form-related props for when the underlying control is an `input` */
const INPUT_FORM_PROPS = [
  "checked",
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "required",
  "value",
  "min",
  "max",
  "step",
  "multiple",
  "pattern",
  "list",
  "minLength",
  "maxLength",
  "readOnly",
  "placeholder",
  "autoComplete",
] as const satisfies (keyof ComponentProps<"input">)[];

/** Form-related props for when the underlying control is a `textarea` */
const TEXTAREA_FORM_PROPS = [
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "required",
  "value",
  "minLength",
  "maxLength",
  "readOnly",
  "placeholder",
  "autoComplete",
] as const satisfies (keyof ComponentProps<"textarea">)[];

type ControlElementType = "textarea" | "button" | "input";

type ControlProp = (typeof CONTROL_PROPS)[number];

type DisallowedProp = (typeof DISALLOWED_PROPS)[number];

type FormProp<C extends ControlElementType> = {
  button: (typeof BUTTON_FORM_PROPS)[number];
  input: (typeof INPUT_FORM_PROPS)[number];
  textarea: (typeof TEXTAREA_FORM_PROPS)[number];
}[C];

type FormProps<C extends ControlElementType> = {
  [key in FormProp<C>]?: ComponentProps<"input">[key];
};

type ControlProps<C extends ControlElementType> = {
  [key in ControlProp]?: ComponentProps<C>[key];
};

type WrapperProps<W extends ElementType, C extends ControlElementType> = Omit<
  ComponentProps<W>,
  FormProp<C> | ControlProp | DisallowedProp | keyof AriaAttributes
>;

/**
 * Helper generic that lets us define a form input component's prop surface
 *
 * `W` represents the element type of the wrapping component. Typically this
 * will be a `div`.
 *
 * `C` represents the element type of the underlying control element. One of `button`, `input`, or `textarea`.
 *
 * `O` represents any remaining props we want to omit from the result
 * */
export type FormInputProps<
  W extends ElementType,
  C extends ControlElementType,
  O extends string = never,
> = Omit<
  WrapperProps<W, C> & ControlProps<C> & FormProps<C> & AriaAttributes,
  O
>;

/**
 * Splits a given `props` object into four buckets: `ariaProps`, `controlProps`,
 * `formProps`, and `wrapperProps`.
 *
 * @see splitFormProps
 * @see splitControlProps
 * @see splitAriaProps
 *
 * @example
 * const {
 *   ariaProps,
 *   controlProps,
 *   formProps,
 *   wrapperProps
 * } = splitFormInputProps(props)
 */
export function splitFormInputProps<A extends object>(props: A) {
  const [formProps, _props] = splitFormProps(props);
  const [controlProps, __props] = splitControlProps(_props);
  const [ariaProps, wrapperProps] = splitAriaProps(__props);

  return {
    ariaProps,
    controlProps,
    formProps,
    wrapperProps,
  };
}

const disallowedPropsSet = new Set(DISALLOWED_PROPS);
const ariaPropsSet = new Set(ARIA_PROPS);
const controlPropsSet = new Set(CONTROL_PROPS);
const formPropsSet = new Set([
  ...INPUT_FORM_PROPS,
  ...TEXTAREA_FORM_PROPS,
  ...BUTTON_FORM_PROPS,
]);

/**
 * Splits a given `props` object into two buckets based on whether a prop is a control prop or not
 *
 * @see CONTROL_PROPS
 *
 * @example
 * const [controlProps, restProps] = splitControlProps(props)
 * */
export function splitControlProps<A extends object>(props: A) {
  return splitProps(props, controlPropsSet);
}

/**
 * Splits a given `props` object into two buckets based on whether a prop is a form prop or not
 *
 * @see INPUT_FORM_PROPS
 * @see BUTTON_FORM_PROPS
 * @see TEXTAREA_FORM_PROPS
 *
 * @example
 * const [formProps, restProps] = splitFormProps(props)
 * */
export function splitFormProps<A extends object>(props: A) {
  return splitProps(props, formPropsSet);
}

/**
 * Splits a given `props` object into two buckets based on whether a prop is an aria-attribute or not
 *
 * @see ARIA_PROPS
 *
 * @example
 * const [ariaProps, restProps] = splitAriaProps(props)
 * */
export function splitAriaProps<A extends object>(props: A) {
  return splitProps(props, ariaPropsSet);
}

/**
 * Splits a given `props` object into two buckets based on a given set of keys, ignoring disallowed props
 *
 * @see DISALLOWED_PROPS
 *
 * @example
 * const [propsWithFoo, propsWithBat] = splitProps(
 *   { foo: "bar", bat: "baz" },
 *   new Set(["foo"] as const),
 * )
 * */
export function splitProps<A extends object, K extends string>(
  props: A,
  keys: Set<K>,
) {
  const a = {} as OmitUnknown<Omit<A, K | DisallowedProp>>;
  // @ts-expect-error ts not smart enough to do this
  const b = {} as OmitUnknown<Pick<A, K | DisallowedProp>>;

  for (const prop in props) {
    // reject inherited props like prototype methods, etc
    if (!Object.hasOwn(props, prop)) continue;
    // @ts-expect-error ts is not smart enough to do this
    if (disallowedPropsSet.has(prop)) continue;
    // @ts-expect-error ts is not smart enough to do this
    if (keys.has(prop)) b[prop] = props[prop];
    // @ts-expect-error ts is not smart enough to do this
    else a[prop] = props[prop];
  }

  return [b, a] as const;
}

type OmitUnknown<T> = {
  [
    K in keyof T as unknown extends T[K]
      ? T[K] extends unknown
        ? never
        : K
      : K
  ]: T[K];
};
