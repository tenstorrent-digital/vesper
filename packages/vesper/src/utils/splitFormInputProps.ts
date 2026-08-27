import type { ComponentProps, ElementType } from "react";

/**
 * The element a given prop should be applied to.
 *
 * - `form` — the element carrying the submitted value (a native input, or a hidden input/select
 *   rendered by a primitive)
 * - `control` — the element owning ARIA, focus, and keyboard interaction
 * - `wrapper` — the presentational layout element
 *
 * `form` and `control` resolve to the same element for simple inputs (`checkbox`, `text-input`,
 * `text-area`) and diverge for composed ones (`select`, `combobox`).
 */
export type FormInputTarget = "form" | "control" | "wrapper";

/**
 * Props that carry the value submitted with form data.
 *
 * Declared once, as the single source for both the runtime lookup and the `FormProp` union, so the
 * two cannot drift apart.
 */
const FORM_PROPS = [
  "checked",
  "defaultChecked",
  "defaultValue",
  "disabled",
  "form",
  "name",
  "required",
  "value",
] as const satisfies readonly (keyof ComponentProps<"input">)[];

/**
 * Props that belong on the interactive control rather than the presentational wrapper.
 *
 * `*Capture` variants are not listed: they are resolved by stripping the suffix and classifying the
 * base handler, so the two can never be routed to different elements.
 */
const CONTROL_PROPS = [
  "autoComplete",
  "autoCorrect",
  "autoFocus",
  "enterKeyHint",
  "id",
  "inputMode",
  "list",
  "max",
  "maxLength",
  "min",
  "minLength",
  "multiple",
  "onBeforeInput",
  "onBlur",
  "onChange",
  "onFocus",
  "onInput",
  "onInvalid",
  "onKeyDown",
  "onKeyUp",
  "onPaste",
  "pattern",
  "placeholder",
  "readOnly",
  "role",
  "spellCheck",
  "tabIndex",
] as const satisfies readonly (keyof ComponentProps<"input">)[];

/**
 * ARIA attributes routed to the control.
 *
 * NOTE: this is deliberately limited to the four attributes that reach the control today, so that
 * adopting the router is behaviour-preserving. Widening this to "every ARIA attribute except the
 * container-scoped ones" is the P1 change — see `.agents/plans/TT-785_PLAN.md` §3.2.
 */
const CONTROL_ARIA_PROPS = [
  "aria-describedby",
  "aria-invalid",
  "aria-label",
  "aria-labelledby",
] as const;

export type FormProp = (typeof FORM_PROPS)[number];

export type ControlProp = (typeof CONTROL_PROPS)[number];

export type ControlAriaProp = (typeof CONTROL_ARIA_PROPS)[number];

/**
 * Every prop a form input routes away from its wrapper and onto the control.
 *
 * Derived from the same arrays that drive the runtime router, so the type and the runtime
 * behaviour cannot disagree.
 */
export type FormInputControlProp = FormProp | ControlProp | ControlAriaProp;

/**
 * The prop surface shared by form inputs that render a `FormInputWrapper` around a native control.
 *
 * Control-bound props are typed against the control element, and everything else against the
 * wrapping `div`. Props that don't exist on the given control element are dropped automatically —
 * `pattern` and `multiple`, for instance, resolve away for `textarea`.
 */
export type FormInputProps<E extends ElementType> = Omit<
  ComponentProps<"div">,
  FormInputControlProp
> &
  Pick<
    ComponentProps<E>,
    Extract<FormInputControlProp, keyof ComponentProps<E>>
  >;

const FORM_PROP_SET: ReadonlySet<string> = new Set(FORM_PROPS);

const CONTROL_PROP_SET: ReadonlySet<string> = new Set(CONTROL_PROPS);

const CONTROL_ARIA_PROP_SET: ReadonlySet<string> = new Set(CONTROL_ARIA_PROPS);

const CAPTURE_SUFFIX = "Capture";

/**
 * Resolves an event handler's base name, so that `onKeyDownCapture` classifies as `onKeyDown`.
 */
function getBaseHandlerName(prop: string) {
  if (!prop.startsWith("on") || !prop.endsWith(CAPTURE_SUFFIX)) return prop;
  return prop.slice(0, -CAPTURE_SUFFIX.length);
}

export interface SplitFormInputPropsOptions {
  /**
   * Props owned by the underlying primitive, which are dropped rather than routed. Used for
   * attributes a component's primitive manages itself, eg. `aria-expanded` on a Base UI trigger.
   */
  reserved?: readonly string[];
  /**
   * Per-prop target overrides, for props that must be pinned to an element other than their
   * default bucket, eg. `disabled` on a `fieldset` so the native descendant cascade is preserved.
   */
  overrides?: Readonly<Record<string, FormInputTarget>>;
}

/**
 * Determines which element a single prop should be applied to.
 */
export function classifyFormInputProp(
  prop: string,
  options: SplitFormInputPropsOptions = {},
): FormInputTarget | null {
  const { reserved, overrides } = options;

  if (overrides && prop in overrides) return overrides[prop]!;
  if (reserved?.includes(prop)) return null;

  if (prop.startsWith("data-")) return "wrapper";
  if (prop.startsWith("aria-")) {
    return CONTROL_ARIA_PROP_SET.has(prop) ? "control" : "wrapper";
  }

  const base = getBaseHandlerName(prop);

  if (FORM_PROP_SET.has(base)) return "form";
  if (CONTROL_PROP_SET.has(base)) return "control";

  return "wrapper";
}

export interface SplitFormInputPropsResult {
  /** Props for the element carrying the submitted value */
  formProps: Record<string, unknown>;
  /** Props for the element owning ARIA, focus, and keyboard interaction */
  controlProps: Record<string, unknown>;
  /** Props for the presentational layout element */
  wrapperProps: Record<string, unknown>;
}

/**
 * Partitions a form input's props into the element each one belongs on.
 *
 * Replaces the hand-maintained `ForwardedPropTypes` allowlists that each form input used to
 * declare, so that a prop's destination is decided in one place instead of six.
 *
 * @example
 * const { formProps, controlProps, wrapperProps } = splitFormInputProps(rest);
 *
 * <FormInputWrapper {...wrapperProps}>
 *   <input {...formProps} {...controlProps} />
 * </FormInputWrapper>
 */
export function splitFormInputProps(
  props: Record<string, unknown>,
  options: SplitFormInputPropsOptions = {},
): SplitFormInputPropsResult {
  const formProps: Record<string, unknown> = {};
  const controlProps: Record<string, unknown> = {};
  const wrapperProps: Record<string, unknown> = {};

  for (const prop of Object.keys(props)) {
    const target = classifyFormInputProp(prop, options);
    if (target === null) continue;

    if (target === "form") formProps[prop] = props[prop];
    else if (target === "control") controlProps[prop] = props[prop];
    else wrapperProps[prop] = props[prop];
  }

  return { formProps, controlProps, wrapperProps };
}
