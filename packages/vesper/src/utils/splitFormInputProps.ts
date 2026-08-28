import type { AriaAttributes, ComponentProps, ElementType } from "react";

const DISALLOWED_PROPS = [
  "role",
  "children",
  "dangerouslySetInnerHTML",
] as const;

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
] as const;

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
] as const;

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
> = WrapperProps<W, C> & ControlProps<C> & FormProps<C> & AriaAttributes;

export function splitFormInputProps<A>(props: A) {
  const [_props, controlProps] = splitControlProps(props);
  const [__props, formProps] = splitFormProps(_props);
  const [wrapperProps, ariaProps] = splitAriaProps(__props);

  return {
    ariaProps,
    controlProps,
    formProps,
    wrapperProps,
  };
}

export function splitControlProps<A>(props: A) {
  return splitProps(props, CONTROL_PROPS);
}

export function splitFormProps<A>(props: A) {
  return splitProps(props, INPUT_FORM_PROPS);
}

export function splitAriaProps<A>(props: A) {
  return splitProps(props, ARIA_PROPS);
}

function splitProps<A, K extends string>(props: A, keys: readonly K[]) {
  const a = {} as OmitUnknown<Omit<A, K>>;
  // @ts-expect-error ts not smart enough to do this
  const b = {} as OmitUnknown<Pick<A, K>>;

  for (const prop in props) {
    // @ts-expect-error ts not smart enough to do this
    if (keys.includes(prop)) b[prop] = props[prop];
    // @ts-expect-error ts not smart enough to do this
    else a[prop] = props[prop];
  }

  return [a, b] as const;
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
