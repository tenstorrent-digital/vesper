import { useEffect, useMemo, useRef } from "react";

import { fireReactOnChange } from "@/utils/fireReactOnChange";

import { compareOptions } from "./compareOptions";
import { getInputType } from "./getInputType";
import { getNextTrackerState } from "./getNextTrackerState";
import { normalizeOptions } from "./normalizeOptions";
import { SyntheticChangeError } from "./SyntheticChangeError";
import type {
  CacheState,
  MaskOptions,
  TimeoutState,
  TrackerState,
} from "./types";
import { validate } from "./validate";

const ALLOWED_TYPES = ["text", "email", "tel", "search", "url"];

const isInputElement = (
  element: HTMLElement | null,
): element is HTMLInputElement => element?.tagName === "INPUT";

export function useInputMask(
  element: HTMLInputElement | HTMLTextAreaElement | null,
  options: MaskOptions,
) {
  const canonicalOptions = useCanonicalOptions(options);

  useEffect(() => {
    if (
      !canonicalOptions.mask ||
      element === null ||
      !isInputElement(element) ||
      !ALLOWED_TYPES.includes(element.type)
    ) {
      return;
    }

    const options = normalizeOptions(canonicalOptions);
    const value = "";
    if (!validate({ initialValue: value, ...options })) return;

    const cache: CacheState = {
      value,
      options,
      fallbackOptions: options,
    };

    const timeout: TimeoutState = {
      id: -1,
      cachedId: -1,
    };

    const tracker: TrackerState = {
      value: "",
      selectionStart: 0,
      selectionEnd: 0,
    };

    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    );

    Object.defineProperty(element, "value", {
      ...descriptor,
      set: (value: string) => {
        tracker.value = value;
        descriptor?.set?.call(element, value);
      },
    });

    element.value = value;

    const onFocus = () => {
      const setSelection = () => {
        tracker.selectionStart = element.selectionStart ?? 0;
        tracker.selectionEnd = element.selectionEnd ?? 0;
        timeout.id = window.setTimeout(setSelection);
      };
      timeout.id = window.setTimeout(setSelection);
    };

    const onBlur = () => {
      window.clearTimeout(timeout.id);

      timeout.id = -1;
      timeout.cachedId = -1;
    };

    const onInput = (event: Event) => {
      try {
        if (timeout.cachedId === timeout.id) {
          throw new SyntheticChangeError(
            "The input selection has not been updated.",
          );
        }

        timeout.cachedId = timeout.id;

        const { value, selectionStart, selectionEnd } = element;

        if (selectionStart === null || selectionEnd === null) {
          throw new SyntheticChangeError(
            "The selection attributes have not been initialized.",
          );
        }

        const inputType = getInputType({
          event,
          tracker,
          value,
          selectionStart,
        });

        const tracking = getNextTrackerState({
          inputType,
          options,
          cache,
          selectionStart,
          tracker,
          value,
        });

        element.value = tracking.value;
        element.setSelectionRange(
          tracking.selectionStart,
          tracking.selectionEnd,
        );

        cache.value = tracking.value;
        cache.options = options;

        tracker.selectionStart = tracking.selectionStart;
        tracker.selectionEnd = tracking.selectionEnd;
      } catch (error) {
        element.value = tracker.value;
        element.setSelectionRange(tracker.selectionStart, tracker.selectionEnd);

        event.preventDefault();
        event.stopPropagation();

        if ((error as SyntheticChangeError).name !== "SyntheticChangeError") {
          throw error;
        }
      }
    };

    if (document.activeElement === element) {
      onFocus();
    }

    element.addEventListener("focus", onFocus);
    element.addEventListener("blur", onBlur);
    element.addEventListener("input", onInput);

    return () => {
      element.removeEventListener("focus", onFocus);
      element.removeEventListener("blur", onBlur);
      element.removeEventListener("input", onInput);
      fireReactOnChange(element, "");
    };
  }, [element, canonicalOptions]);
}

function useCanonicalOptions(options: MaskOptions) {
  const canonical = useRef<MaskOptions>(options);

  return useMemo<MaskOptions>(() => {
    if (!compareOptions(canonical.current, options)) {
      canonical.current = options;
    }
    return canonical.current;
  }, [options]);
}
