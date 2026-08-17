import { filter } from "./filter";
import { format } from "./format";
import { SyntheticChangeError } from "./SyntheticChangeError";
import type {
  CacheState,
  InputType,
  NormalizedOptions,
  TrackerState,
} from "./types";
import { unformat } from "./unformat";

export function getValueChanges({
  inputType,
  options,
  cache,
  selectionStart,
  tracker,
  value,
}: {
  inputType: InputType;
  options: NormalizedOptions;
  cache: CacheState;
  selectionStart: number;
  tracker: TrackerState;
  value: string;
}) {
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

  let replacementChars = options.mask.replace(
    RegExp(`[^${Object.keys(options.replacement).join("")}]`, "g"),
    "",
  );

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

  const changedValue = beforeChangeValue + addedValue + afterChangeValue;
  const nextValue = format(changedValue, options);

  return { nextValue, beforeChangeValue, addedValue };
}
