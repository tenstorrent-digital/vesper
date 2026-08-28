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

export function splitFormInputProps<A, O extends string = never>(
  props: A,
  omit = [] as O[],
) {
  const [propsWithoutControl, controlProps] = splitProps(
    props,
    CONTROL_PROPS,
    omit,
  );
  const [propsWithoutForm, formProps] = splitProps(
    propsWithoutControl,
    INPUT_FORM_PROPS,
    omit,
  );
  const [wrapperProps, ariaProps] = splitProps(
    propsWithoutForm,
    ARIA_PROPS,
    omit,
  );

  return {
    ariaProps,
    controlProps,
    formProps,
    wrapperProps,
  };
}

function splitProps<A, K extends string, O extends string = never>(
  props: A,
  keys: readonly K[],
  omit = [] as O[],
) {
  const a = {} as Omit<A, K | O>;
  // @ts-expect-error ts not smart enough to do this
  const b = {} as Omit<Pick<A, K>, O>;

  for (const prop in props) {
    // @ts-expect-error ts not smart enough to do this
    if (omit.includes(prop)) continue;
    // @ts-expect-error ts not smart enough to do this
    if (keys.includes(prop)) b[prop] = prop;
    // @ts-expect-error ts not smart enough to do this
    else a[prop] = [prop];
  }

  return [a, b] as const;
}
