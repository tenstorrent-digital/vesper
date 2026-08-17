import { MaskOptions } from "../types";

export function compareOptions(a: MaskOptions, b: MaskOptions) {
  if (b === undefined && a === undefined) return true;
  if (b === undefined && a !== undefined) return false;
  if (a === undefined && b !== undefined) return false;
  if (a.mask !== b.mask) return false;

  if (typeof a.replacement === "string" && typeof b.replacement === "string") {
    return a.replacement === b.replacement;
  }

  if (a.replacement === undefined && b.replacement === undefined) {
    return true;
  }

  if (typeof a.replacement === "object" && typeof b.replacement === "object") {
    const keys = Array.from(
      new Set([...Object.keys(a.replacement), ...Object.keys(b.replacement)]),
    );

    return keys.every((key) => {
      const replacementA = a.replacement as Record<string, RegExp>;
      const replacementB = b.replacement as Record<string, RegExp>;

      const valueA = replacementA[key];
      const valueB = replacementB[key];
      if (!valueA || !valueB) return false;

      return valueA.source === valueB.source && valueA.flags === valueB.flags;
    });
  }

  return false;
}

/**
 * Trigger a React onChange event programmatically.
 *
 * Simply updating an element's value via JavaScript will not fire the event because React intercepts standard DOM setters to manage form states efficiently.
 * */
function fireReactOnChange(inputElement: HTMLInputElement, newValue: string) {
  // 1. Get the native input value setter from the browser prototype
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  // 2. Force the value update directly through the native setter
  nativeInputValueSetter?.call(inputElement, newValue);

  // 3. Dispatch a bubbling input event to notify React's Virtual DOM
  const event = new Event("input", { bubbles: true });
  inputElement.dispatchEvent(event);
}
