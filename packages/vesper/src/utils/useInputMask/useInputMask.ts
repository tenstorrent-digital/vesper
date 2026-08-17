import { useEffect, useMemo, useRef } from "react";

import { compareOptions } from "./utils/compareOptions";
import { filter } from "./utils/filter";
import { fireReactOnChange } from "./utils/fireReactOnChange";
import { format } from "./utils/format";
import { normalizeOptions } from "./utils/normalizeOptions";
import { resolveSelection } from "./utils/resolveSelection";
import { unformat } from "./utils/unformat";
import { validate } from "./utils/validate";
import { SyntheticChangeError } from "./SyntheticChangeError";
import type { InputType, MaskOptions, NormalizedOptions } from "./types";

const ALLOWED_TYPES = ["text", "email", "tel", "search", "url"];

interface TimeoutState {
  cachedId: number;
  id: number;
}

interface CacheState {
  value: string;
  options: NormalizedOptions;
  fallbackOptions: NormalizedOptions;
}

interface TrackerState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

interface TrackingParams {
  inputType: InputType;
  options: NormalizedOptions;
  cache: CacheState;
  selectionStart: number;
  tracker: TrackerState;
  value: string;
}

const isInputElement = (
  element: HTMLElement | null,
): element is HTMLInputElement => element?.tagName === "INPUT";

export function useInputMask(
  element: HTMLInputElement | HTMLTextAreaElement | null,
  options: MaskOptions,
) {
  const canonical = useRef<MaskOptions>(options);
  const canonicalOptions = useMemo<MaskOptions>(() => {
    if (!compareOptions(canonical.current, options)) {
      canonical.current = options;
    }
    return canonical.current;
  }, [options]);

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

function getInputType({
  event,
  tracker,
  value,
  selectionStart,
}: {
  event: Event;
  tracker: TrackerState;
  value: string;
  selectionStart: number;
}): InputType {
  const previousValue = tracker.value;

  let inputType: InputType | null = null;

  // @ts-expect-error if `event.inputType` is missing it resolves to `undefined`
  if (event.inputType === undefined) {
    tracker.selectionStart = 0;
    tracker.selectionEnd = previousValue.length;
  }

  if (selectionStart > tracker.selectionStart) {
    inputType = "insert";
  } else if (
    selectionStart <= tracker.selectionStart &&
    selectionStart < tracker.selectionEnd
  ) {
    inputType = "deleteBackward";
  } else if (
    selectionStart === tracker.selectionEnd &&
    value.length < previousValue.length
  ) {
    inputType = "deleteForward";
  }
  if (
    inputType === null ||
    ((inputType === "deleteBackward" || inputType === "deleteForward") &&
      value.length > previousValue.length)
  ) {
    throw new SyntheticChangeError("Input type detection error.");
  }

  return inputType;
}

function getNextTrackerState({
  inputType,
  options,
  cache,
  selectionStart,
  tracker,
  value,
}: TrackingParams): TrackerState {
  const previousValue = tracker.value;
  let addedValue = "";
  let changeStart = tracker.selectionStart;
  let changeEnd = tracker.selectionEnd;

  if (inputType === "insert") {
    addedValue = value.slice(tracker.selectionStart, selectionStart);
  } else {
    const countDeleted = previousValue.length - value.length;

    changeStart = selectionStart;
    changeEnd = selectionStart + countDeleted;
  }

  if (cache.value !== previousValue) {
    cache.options = cache.fallbackOptions;
  } else {
    cache.fallbackOptions = cache.options;
  }

  const previousOptions = cache.options;

  let beforeChangeValue = unformat(previousValue, {
    end: changeStart,
    options: previousOptions,
  });
  let afterChangeValue = unformat(previousValue, {
    start: changeEnd,
    options: previousOptions,
  });

  const regExp$1 = RegExp(
    `[^${Object.keys(options.replacement).join("")}]`,
    "g",
  );
  let replacementChars = options.mask.replace(regExp$1, "");

  if (beforeChangeValue) {
    beforeChangeValue = filter(beforeChangeValue, {
      replacementChars,
      replacement: options.replacement,
    });
    replacementChars = replacementChars.slice(beforeChangeValue.length);
  }

  if (addedValue) {
    addedValue = filter(addedValue, {
      replacementChars,
      replacement: options.replacement,
    });
    replacementChars = replacementChars.slice(addedValue.length);
  }

  if (inputType === "insert" && addedValue === "") {
    throw new SyntheticChangeError(
      "The character does not match the key value of the `replacement` object.",
    );
  }

  if (afterChangeValue) {
    afterChangeValue = filter(afterChangeValue, {
      replacementChars,
      replacement: options.replacement,
    });
  }

  const input = beforeChangeValue + addedValue + afterChangeValue;
  const nextValue = format(input, options);

  const selection = resolveSelection({
    inputType,
    value: nextValue,
    addedValue,
    beforeChangeValue,
    options,
  });

  return {
    value: nextValue,
    selectionStart: selection,
    selectionEnd: selection,
  };
}
