import { SyntheticChangeError } from "../SyntheticChangeError";
import type { InputType, TrackerState } from "../types";

export function getInputType({
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
