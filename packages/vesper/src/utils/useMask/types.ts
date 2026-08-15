export type InputType = "insert" | "deleteBackward" | "deleteForward";

export type InitFunction<T> = (param: {
  initialValue: string;
  controlled: boolean;
}) => {
  value: string;
  options: T;
};

export type TrackingFunction<T> = (param: {
  inputType: InputType;
  previousValue: string;
  previousOptions: T;
  value: string;
  addedValue: string;
  changeStart: number;
  changeEnd: number;
  selectionStart: number;
  selectionEnd: number;
}) => {
  value: string;
  selectionStart: number;
  selectionEnd: number;
  options: T;
};

export interface InputOptions<T = unknown> {
  init: InitFunction<T>;
  tracking: TrackingFunction<T>;
}

export type InputComponentProps<
  C extends React.ComponentType | undefined = undefined,
> = {
  /** **Not used in the hook**. Serves to enable the use of custom components, for example, if you want to use your own styled component with the ability to format the value. */
  component?: C;
} & (C extends React.ComponentType<infer P>
  ? P
  : React.InputHTMLAttributes<HTMLInputElement>);

// https://github.com/GoncharukOrg/react-input/issues/15
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InputComponent<P extends object> = <
  C extends React.ComponentType<any> | undefined = undefined,
>(
  props: P & InputComponentProps<C> & React.RefAttributes<HTMLInputElement>,
) => React.JSX.Element;

export type Overlap = "full" | "full-inexact" | "partial" | "partial-inexact";

export interface MaskPart {
  type: "replacement" | "mask" | "input";
  value: string;
  index: number;
}

export type Replacement = Record<string, RegExp>;

export type TrackingData = (
  | { inputType: "insert"; data: string }
  | { inputType: "deleteBackward" | "deleteForward"; data: null }
) & {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type Track = (data: TrackingData) => string | boolean | null | undefined;

export interface ModifiedData {
  mask?: string;
  replacement?: string | Replacement;
  showMask?: boolean;
  separate?: boolean;
}

export type Modify = (data: TrackingData) => ModifiedData | undefined;

export interface MaskOptions {
  /** Input mask, `replacement` is used to replace characters. */
  mask?: string;
  /** Sets the characters replaced in the mask, where "key" is the replaced character, "value" is the regular expression to which the input character must match (see «[Replacement](https://github.com/GoncharukOrg/react-input/tree/main/packages/mask#replacement)»). It is possible to pass the replacement character as a string, then `replacement="_"` will default to `replacement={{ _: /./ }}`. Keys are ignored as you type. */
  replacement?: string | Replacement;
  /** Controls the display of the mask, for example, `+0 (123) ___-__-__` instead of `+0 (123`. */
  showMask?: boolean;
  /** Stores the position of the entered characters. By default, input characters are non-breaking, which means that if you remove characters in the middle of the value, the characters are shifted to the left, forming a non-breaking value, which is the behavior of `input`. For example, with `true`, the possible value is `+0 (123) ___-45-__`, with `false` - `+0 (123) 45_-__-__`. */
  separate?: boolean;
  /** The function is activated before masking. Allows you to conditionally change the entered value (see «[Track](https://github.com/GoncharukOrg/react-input/tree/main/packages/mask#track)»). */
  track?: Track;
  /** Function triggered before masking. Allows you conditionally change the properties of the component that affect masking. Valid values for modification are `mask`, `replacement`, `showMask` and `separate`. This is useful when you need conditionally tweak the displayed value to improve UX (see «[Modify](https://github.com/GoncharukOrg/react-input/tree/main/packages/mask#modify)»). */
  modify?: Modify;
}
