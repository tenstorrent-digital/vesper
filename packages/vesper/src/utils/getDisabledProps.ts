import type { ElementType, SyntheticEvent } from "react";

/**
 * Returns the appropriate disabled props for a polymorphic component based on whether the rendered element natively supports the `disabled` attribute.
 *
 * Native form elements (`button`, `input`, `select`, `textarea`, `fieldset`) handle disabled state automatically — the browser suppresses events, removes the element from the tab order, and communicates the state to assistive technologies. For these elements, only `{ disabled: true }` is returned.
 *
 * Non-form elements (`div`, `a`, `span`, etc.) have no built-in disabled behavior, so this helper returns `aria-disabled` for assistive technologies, `tabIndex: -1` to remove from the tab order, and capture-phase event handlers that suppress click, pointer, keyboard, and focus events.
 *
 * Both `disabled` and `aria-disabled` are never applied simultaneously, as doing so can be confusing to assistive technologies.
 */
export function getDisabledProps(e: ElementType, isDisabled: boolean) {
  if (!isDisabled) return {};

  const supportsNativeDisabledAttr =
    e === "button" ||
    e === "input" ||
    e === "select" ||
    e === "textarea" ||
    e === "fieldset";

  if (supportsNativeDisabledAttr) {
    return { disabled: true };
  }

  function suppressEvent(e: SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return {
    ["aria-disabled"]: true,
    tabIndex: -1,
    onClickCapture: suppressEvent,
    onMouseDownCapture: suppressEvent,
    onPointerDownCapture: suppressEvent,
    onKeyDownCapture: suppressEvent,
    onKeyUpCapture: suppressEvent,
    onFocusCapture: suppressEvent,
  };
}
