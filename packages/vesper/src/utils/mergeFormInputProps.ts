import type { CSSProperties, SyntheticEvent } from "react";

import { cn } from "@/utils/cn";
import { composeEventHandlers } from "@/utils/composeEventHandlers";

type Props = Record<string, unknown>;

type EventHandler = (event: SyntheticEvent) => void;

const isEventHandler = (prop: string, value: unknown): value is EventHandler =>
  /^on[A-Z]/.test(prop) && typeof value === "function";

/**
 * Merges an explicit prop bag over the props the router resolved for the same element.
 *
 * Most props are replaced, so the bag has the final say. Three are combined instead, because
 * replacing them would silently discard the component's own styling or behaviour:
 *
 * - `className` is concatenated
 * - `style` is merged key by key
 * - event handlers are composed, base first
 *
 * @example
 * const props = mergeFormInputProps(controlProps, { "data-1p-ignore": true });
 */
export function mergeFormInputProps(base: Props, override?: Props): Props {
  if (!override) return base;

  const merged: Props = { ...base };

  for (const prop of Object.keys(override)) {
    const overrideValue = override[prop];
    const baseValue = merged[prop];

    if (prop === "className") {
      merged[prop] = cn(baseValue as string, overrideValue as string);
      continue;
    }

    if (prop === "style") {
      merged[prop] = {
        ...(baseValue as CSSProperties),
        ...(overrideValue as CSSProperties),
      };
      continue;
    }

    if (
      isEventHandler(prop, overrideValue) &&
      isEventHandler(prop, baseValue)
    ) {
      merged[prop] = composeEventHandlers(baseValue, overrideValue);
      continue;
    }

    merged[prop] = overrideValue;
  }

  return merged;
}
