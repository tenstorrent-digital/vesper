export type InputType = "insert" | "deleteBackward" | "deleteForward";

export interface MaskPart {
  type: "replacement" | "mask" | "input";
  value: string;
  index: number;
}

export type Replacement = Record<string, RegExp>;

export interface MaskOptions {
  /** Input mask, `replacement` is used to replace characters. */
  mask: string;
  /** Sets the characters replaced in the mask, where "key" is the replaced character, "value" is the regular expression to which the input character must match (see «[Replacement](https://github.com/GoncharukOrg/react-input/tree/main/packages/mask#replacement)»). It is possible to pass the replacement character as a string, then `replacement="_"` will default to `replacement={{ _: /./ }}`. Keys are ignored as you type. */
  replacement: string | Replacement;
}

export interface NormalizedOptions {
  mask: string;
  replacement: Replacement;
}

export interface TimeoutState {
  cachedId: number;
  id: number;
}

export interface CacheState {
  value: string;
  options: NormalizedOptions;
  fallbackOptions: NormalizedOptions;
}

export interface TrackerState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}
