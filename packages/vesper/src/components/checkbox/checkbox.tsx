import {
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ComponentProps,
} from "react";
import { cn } from "@/utils/cn";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";
import { Checkmark, Minus } from "@/components/icons/icons";

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
  label: string;
  indeterminate?: boolean;
  size?: CheckboxSize;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function Checkbox({
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
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  useImperativeHandle(inputRef, () => ref.current!);

  return (
    <label
      className={cn(
        "vesper-checkbox",
        `vesper-checkbox-${size}`,
        disabled && "vesper-checkbox-disabled",
        className,
      )}
      {...props}
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
