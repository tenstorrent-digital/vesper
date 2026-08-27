import type { SyntheticEvent } from "react";

/**
 * Composes a consumer-supplied event handler with a component's internal one.
 *
 * The consumer's handler runs first, and the internal handler always runs afterwards — it cannot be
 * suppressed, including by calling `preventDefault()`. `preventDefault()` has independent, legitimate
 * meaning (stopping Space-scroll on `onKeyDown`, stopping text selection on `onPointerDown`), so
 * overloading it to also disable internal behaviour would break components in ways consumers never
 * intended. See `.agents/plans/TT-785_PLAN.md` D-6.
 *
 * Consumer-first ordering matches Base UI and Radix, and leaves room to add an opt-out later
 * without a breaking reorder.
 *
 * @example
 * <input onPointerDown={composeEventHandlers(consumerOnPointerDown, capturePointer)} />
 */
export function composeEventHandlers<E extends SyntheticEvent>(
  consumer: ((event: E) => void) | undefined,
  internal: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    consumer?.(event);
    internal(event);
  };
}
