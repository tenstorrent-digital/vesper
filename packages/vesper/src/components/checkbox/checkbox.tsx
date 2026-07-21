import {
  type ComponentProps,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

import { Checkmark, Minus } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const CHECKBOX_SIZES = ["sm", "md"] as const;

export type CheckboxSize = (typeof CHECKBOX_SIZES)[number];

/**
 * Union of all the prop types that should be forwarded to the input element, and excluded from the containing label element
 */
type ForwardedPropTypes =
  | "id"
  | "form"
  | "value"
  | "autoFocus"
  | "disabled"
  | "name"
  | "required"
  | "checked"
  | "defaultChecked"
  | "role"
  | "tabIndex"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-invalid"
  | "onFocus"
  | "onFocusCapture"
  | "onBlur"
  | "onBlurCapture"
  | "onChange"
  | "onChangeCapture"
  | "onBeforeInput"
  | "onBeforeInputCapture"
  | "onInput"
  | "onInputCapture"
  | "onReset"
  | "onResetCapture"
  | "onSubmit"
  | "onSubmitCapture"
  | "onInvalid"
  | "onInvalidCapture"
  | "onKeyDown"
  | "onKeyDownCapture"
  | "onKeyUp"
  | "onKeyUpCapture";

export interface CheckboxProps
  extends
    Omit<ComponentProps<"label">, "children" | "onChange" | ForwardedPropTypes>,
    Pick<ComponentProps<"input">, ForwardedPropTypes> {
  /** The text label displayed next to the checkbox. An asterisk is appended when `required` is true. */
  label: string;
  /** When true, renders the checkbox in an indeterminate (mixed) state, displaying a dash icon instead of a checkmark. */
  indeterminate?: boolean;
  /** The size of the checkbox and its label. Defaults to `"md"`. */
  size?: CheckboxSize;
  /** A ref forwarded to the underlying `<input>` element for direct DOM access. */
  inputRef?: RefObject<HTMLInputElement | null>;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

/**
 * A checkbox input with a label, supporting checked, unchecked, and indeterminate states.
 *
 * @example
 * // Uncontrolled usage
 * <Checkbox label="Accept terms" required />
 *
 * @example
 * // Controlled usage
 * <Checkbox
 *   label="Consent to marketing communications"
 *   checked={allowMarketing}
 *   onChange={(e) => setAllowMarketing(e.target.checked)}
 * />
 *
 * @example
 * // Indeterminate state usage
 * <Checkbox
 *   label="Select/deselect all options"
 *   indeterminate={!allOptionsSelected}
 *   onChange={(e) => setAllOptionsSelected(e.target.checked)}
 * />
 */
export function Checkbox(props: CheckboxProps) {
  const {
    // component-specific props
    label,
    size = "md",
    indeterminate,
    inputRef,
    // props forwarded to the inner input
    id,
    form,
    value,
    autoFocus,
    disabled,
    name,
    required,
    checked,
    defaultChecked,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-describedby": ariaDescribedby,
    "aria-invalid": ariaInvalid,
    onFocus,
    onFocusCapture,
    onBlur,
    onBlurCapture,
    onChange,
    onChangeCapture,
    onBeforeInput,
    onBeforeInputCapture,
    onInput,
    onInputCapture,
    onReset,
    onResetCapture,
    onSubmit,
    onSubmitCapture,
    onInvalid,
    onInvalidCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    // props spread onto the wrapper label
    className,
    ...rest
  } = props;

  const ref = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  useImperativeHandle(inputRef, () => ref.current!);

  return (
    <label
      className={cn("vesper-checkbox", `vesper-checkbox-${size}`, className)}
      {...rest}
    >
      <input
        ref={ref}
        type="checkbox"
        className="vesper-checkbox-input"
        id={id}
        form={form}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        name={name}
        required={required}
        checked={checked}
        defaultChecked={defaultChecked}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        onChange={onChange}
        onFocus={onFocus}
        onFocusCapture={onFocusCapture}
        onBlur={onBlur}
        onBlurCapture={onBlurCapture}
        onChangeCapture={onChangeCapture}
        onBeforeInput={onBeforeInput}
        onBeforeInputCapture={onBeforeInputCapture}
        onInput={onInput}
        onInputCapture={onInputCapture}
        onReset={onReset}
        onResetCapture={onResetCapture}
        onSubmit={onSubmit}
        onSubmitCapture={onSubmitCapture}
        onInvalid={onInvalid}
        onInvalidCapture={onInvalidCapture}
        onKeyDown={onKeyDown}
        onKeyDownCapture={onKeyDownCapture}
        onKeyUp={onKeyUp}
        onKeyUpCapture={onKeyUpCapture}
      />
      <div className="vesper-checkbox-box">
        <div className="vesper-checkbox-indicator">
          <Checkmark className="vesper-checkbox-checked-icon" />
          <Minus className="vesper-checkbox-indeterminate-icon" />
        </div>
      </div>
      <Typography
        variant={CHECKBOX_TYPOGRAPHY[size]}
        className="vesper-checkbox-label"
        as="span"
      >
        {required ? label + " *" : label}
      </Typography>
    </label>
  );
}
