/**
 * Trigger a React onChange event programmatically.
 *
 * Simply updating an element's value via JavaScript will not fire the event because React intercepts standard DOM setters to manage form states efficiently.
 * */
export function fireReactOnChange(
  inputElement: HTMLInputElement,
  newValue: string,
) {
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
