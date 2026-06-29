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

export interface CheckboxProps extends Omit<
  ComponentProps<"label">,
  "children" | "defaultChecked" | "onChange"
> {
  label: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  size?: CheckboxSize;
  onChange?(value: boolean): void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const CHECKBOX_TYPOGRAPHY: { [S in CheckboxSize]: TypographyVariant } = {
  sm: "label-md",
  md: "label-lg",
};

export function Checkbox({
  required,
  label,
  size = "md",
  className,
  disabled,
  name,
  checked,
  defaultChecked,
  onChange,
  indeterminate,
  inputRef,
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
        defaultChecked={defaultChecked}
        checked={checked}
        name={name}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
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
