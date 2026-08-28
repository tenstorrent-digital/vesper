import type { AriaAttributes, ComponentProps, ElementType } from "react";

const DISALLOWED_PROPS = [
  "role",
  "children",
  "dangerouslySetInnerHTML",
] as const satisfies (keyof ComponentProps<"div">)[];

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

export type AssertAllAriaAttributesAccountedFor = AssertNever<
  Exclude<keyof AriaAttributes, (typeof ARIA_PROPS)[number]>
>;

const BUTTON_FORM_PROPS = [
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "value",
] as const satisfies (keyof ComponentProps<"button">)[];

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

export type FormInputProps<
  W extends ElementType,
  C extends ControlElementType,
  O extends string = never,
> = Omit<
  WrapperProps<W, C> & ControlProps<C> & FormProps<C> & AriaAttributes,
  O
>;

export function splitFormInputProps<A>(props: A, control: ControlElementType) {
  const [formProps, _props] = splitFormProps(props, control);
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
const formPropsSets = {
  input: new Set(INPUT_FORM_PROPS),
  button: new Set(BUTTON_FORM_PROPS),
  textarea: new Set(TEXTAREA_FORM_PROPS),
};

export function splitControlProps<A>(props: A) {
  return splitProps(props, controlPropsSet);
}

export function splitFormProps<A, C extends ControlElementType>(
  props: A,
  control: C,
) {
  return splitProps(props, formPropsSets[control]);
}

export function splitAriaProps<A>(props: A) {
  return splitProps(props, ariaPropsSet);
}

export function splitProps<A, K extends string>(props: A, keys: Set<K>) {
  const a = {} as OmitUnknown<Omit<A, K | DisallowedProp>>;
  // @ts-expect-error ts not smart enough to do this
  const b = {} as OmitUnknown<Pick<A, K | DisallowedProp>>;

  for (const prop in props) {
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
