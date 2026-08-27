import type { AriaAttributes, ComponentProps, ElementType } from "react";

import { warnOnce } from "@/utils/warnOnce";

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
  "ref",
  "spellCheck",
  "tabIndex",
  "title",
] as const satisfies readonly (keyof ComponentProps<"input">)[];

/**
 * ARIA attributes that describe the field as a region rather than the control within it, and so
 * belong on the wrapper. `aria-live` on the control, for instance, would not announce the message,
 * because the message is a sibling of the control rather than a descendant.
 */
const WRAPPER_ARIA_PROPS = [
  "aria-atomic",
  "aria-busy",
  "aria-colcount",
  "aria-colindex",
  "aria-colindextext",
  "aria-colspan",
  "aria-level",
  "aria-live",
  "aria-posinset",
  "aria-relevant",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowindextext",
  "aria-rowspan",
  "aria-setsize",
] as const;

/**
 * Props that are dropped rather than routed, because no destination is correct.
 *
 * - `aria-hidden` would hide a subtree containing a focusable element, which is an ARIA violation.
 *   Use `hidden` or `inert` to hide the whole field instead.
 * - `role` would override a native control's implicit role, or a role a primitive manages itself.
 * - `children` is ignored anyway, since JSX children take precedence over spread ones.
 * - `dangerouslySetInnerHTML` would replace the component's own content.
 */
const DENIED_PROPS = [
  "aria-hidden",
  "children",
  "dangerouslySetInnerHTML",
  "role",
] as const;

export type FormProp = (typeof FORM_PROPS)[number];

export type ControlProp = (typeof CONTROL_PROPS)[number];

export type DeniedProp = (typeof DENIED_PROPS)[number];

/**
 * Every prop a form input routes away from its wrapper and onto the control.
 *
 * Derived from the same arrays that drive the runtime router, so the type and the runtime
 * behaviour cannot disagree. ARIA attributes are included wholesale, minus the region-scoped and
 * denied ones, since `AriaAttributes` is accepted by the wrapper's own prop type regardless.
 */
export type FormInputControlProp =
  | FormProp
  | ControlProp
  | Exclude<
      keyof AriaAttributes,
      (typeof WRAPPER_ARIA_PROPS)[number] | DeniedProp
    >;

/**
 * Explicit prop bags, for anything the routing rules can't infer — a vendor attribute, a
 * control-scoped `data-testid`, or a ref to the wrapper.
 *
 * A control ref is the top-level `ref`, so `controlProps` does not accept one.
 */
export interface FormInputSlotProps<E extends ElementType> {
  /** Props applied directly to the control, merged over the routed props */
  controlProps?: Omit<ComponentProps<E>, "children" | "ref">;
  /** Props applied directly to the layout wrapper, merged over the routed props */
  wrapperProps?: Omit<ComponentProps<"div">, "children">;
}

/**
 * The prop surface shared by form inputs that render a `FormInputWrapper` around a native control.
 *
 * Control-bound props are typed against the control element, and everything else against the
 * wrapping `div`. Props that don't exist on the given control element are dropped automatically —
 * `pattern` and `multiple`, for instance, resolve away for `textarea`. Props the router refuses to
 * route are omitted entirely, so passing one is a compile error rather than a silent no-op.
 */
export type FormInputProps<E extends ElementType> = Omit<
  ComponentProps<"div">,
  FormInputControlProp | DeniedProp
> &
  Pick<
    ComponentProps<E>,
    Extract<FormInputControlProp, keyof ComponentProps<E>>
  > &
  FormInputSlotProps<E>;

const FORM_PROP_SET: ReadonlySet<string> = new Set(FORM_PROPS);

const CONTROL_PROP_SET: ReadonlySet<string> = new Set(CONTROL_PROPS);

const WRAPPER_ARIA_PROP_SET: ReadonlySet<string> = new Set(WRAPPER_ARIA_PROPS);

const DENIED_PROP_SET: ReadonlySet<string> = new Set(DENIED_PROPS);

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
  /** The component name used in development warnings */
  name?: string;
}

/**
 * Explains why a dropped prop was dropped, so the warning points at a fix rather than just
 * reporting that nothing happened.
 */
const DENIED_PROP_REASONS: Record<string, string> = {
  "aria-hidden":
    "it would hide a subtree containing a focusable element, which is invalid ARIA. Use `hidden` or `inert` to hide the whole field",
  role: "it would override the control's implicit role, or one the underlying primitive manages itself",
  children: "this component renders its own content",
  dangerouslySetInnerHTML: "this component renders its own content",
};

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
  if (DENIED_PROP_SET.has(prop)) return null;

  if (prop.startsWith("data-")) return "wrapper";
  if (prop.startsWith("aria-")) {
    return WRAPPER_ARIA_PROP_SET.has(prop) ? "wrapper" : "control";
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

  const component = options.name ?? "This component";

  for (const prop of Object.keys(props)) {
    const target = classifyFormInputProp(prop, options);

    if (target === null) {
      const reason = DENIED_PROP_REASONS[prop];
      warnOnce(
        reason
          ? `\`${prop}\` is not forwarded, because ${reason}.`
          : `\`${prop}\` is not forwarded: ${component} manages it internally.`,
      );
      continue;
    }

    if (target === "form") formProps[prop] = props[prop];
    else if (target === "control") controlProps[prop] = props[prop];
    else wrapperProps[prop] = props[prop];
  }

  return { formProps, controlProps, wrapperProps };
}
