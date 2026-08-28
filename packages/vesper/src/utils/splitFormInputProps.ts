import type { AriaAttributes, ComponentProps, ElementType } from "react";

const DISALLOWED_PROPS = ["children", "dangerouslySetInnerHTML"] as const;

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

const FORM_PROPS = [
  "checked",
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "required",
  "value",
] as const satisfies (keyof ComponentProps<"input">)[];

const disallowedPropsSet: ReadonlySet<string> = new Set(DISALLOWED_PROPS);
const controlPropsSet: ReadonlySet<string> = new Set(CONTROL_PROPS);
const ariaPropsSet: ReadonlySet<string> = new Set(ARIA_PROPS);
const formPropsSet: ReadonlySet<string> = new Set(FORM_PROPS);

type ControlElementType = "textarea" | "button" | "input";

type ControlProp = (typeof CONTROL_PROPS)[number];

type DisallowedProp = (typeof DISALLOWED_PROPS)[number];

type FormProp = (typeof FORM_PROPS)[number];

type FormProps = {
  [key in FormProp]?: ComponentProps<"input">[key];
};

type ControlProps<C extends ControlElementType> = {
  [key in ControlProp]?: ComponentProps<C>[key];
};

type AriaAttribute = keyof AriaAttributes;

type WrapperProps<W extends ElementType> = Omit<
  ComponentProps<W>,
  FormProp | ControlProp | AriaAttribute | DisallowedProp
>;

export type FormInputProps<
  W extends ElementType,
  C extends ControlElementType,
> = Omit<ComponentProps<W>, ControlProp | FormProp> &
  Pick<ComponentProps<C>, ControlProp> &
  (C extends "input" ? Pick<ComponentProps<C>, FormProp> : never);

type FormInputProp<
  W extends ElementType,
  C extends ControlElementType,
> = keyof FormInputProps<W, C>;

export function splitFormInputProps<
  W extends ElementType,
  C extends ControlElementType,
>(
  props: FormInputProps<W, C>,
  { exclude = [] } = {} as {
    exclude?: FormInputProp<W, C>[];
  },
) {
  const controlProps: ControlProps<C> = {};
  const wrapperProps = {} as WrapperProps<W>;
  const ariaProps: AriaAttributes = {};
  const formProps: FormProps = {};

  for (const prop in props) {
    if (
      exclude.includes(prop as FormInputProp<W, C>) ||
      disallowedPropsSet.has(prop)
    ) {
      continue;
    }
    if (ariaPropsSet.has(prop)) {
      ariaProps[prop as AriaAttribute] = props[prop];
      continue;
    }
    if (controlPropsSet.has(prop)) {
      controlProps[prop as ControlProp] = props[prop];
      continue;
    }
    if (formPropsSet.has(prop)) {
      formProps[prop as FormProp] = props[prop];
      continue;
    }
    wrapperProps[prop as keyof WrapperProps<W>] = props[prop];
  }

  return {
    controlProps,
    wrapperProps,
    ariaProps,
    formProps,
  };
}
