import { getValueChanges } from "./getValueChanges";
import { resolveSelection } from "./resolveSelection";
import type {
  CacheState,
  InputType,
  NormalizedOptions,
  TrackerState,
} from "./types";

export function getNextTrackerState({
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
}): TrackerState {
  const { nextValue, beforeChangeValue, addedValue } = getValueChanges({
    inputType,
    options,
    cache,
    selectionStart,
    tracker,
    value,
  });

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
