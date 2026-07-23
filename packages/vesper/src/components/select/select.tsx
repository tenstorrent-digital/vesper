"use client";

import {
  type ComponentProps,
  type ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";

import { CaretDown, CaretUp, Checkmark } from "@/components/icons/icons";
import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const SELECT_SIZES = ["sm", "md", "lg"] as const;

export type SelectSize = (typeof SELECT_SIZES)[number];

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  icon?: ReactNode;
  size?: SelectSize;
  placeholder?: string;
  options: SelectItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?(value: string): void;
  required?: boolean;
  form?: string;
}

const SELECT_TRIGGER_TYPOGRAPHY: { [S in SelectSize]: TypographyVariant } = {
  sm: "copy-xs",
  md: "copy-sm",
  lg: "copy-md",
};

export function Select(props: SelectProps) {
  const {
    className,
    disabled,
    placeholder = "Select an option",
    options,
    value,
    defaultValue,
    onValueChange,
    size = "lg",
    icon,
    name,
    required,
    form,
    "aria-label": ariaLabel = placeholder,
    ref,
    ...rest
  } = props;

  const [innerRef, setInnerRef] = useState<HTMLButtonElement | null>(null);
  useImperativeHandle(ref, () => innerRef!);

  /**
   * dialogs render in their own stacking context above the document body,
   * so select elements that are rendered inside dialogs must portal into
   * the dialog element itself, or else they will render behind the dialog
   */
  const container = innerRef?.closest("dialog") || document.body;

  return (
    <SelectRoot
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
      form={form}
    >
      <SelectTrigger
        className={cn("vesper-select", `vesper-select-${size}`, className)}
        disabled={disabled}
        aria-label={ariaLabel}
        ref={setInnerRef}
        {...rest}
      >
        {icon && <span className="vesper-select-icon">{icon}</span>}
        <Typography as="span" variant={SELECT_TRIGGER_TYPOGRAPHY[size]}>
          <SelectValue placeholder={placeholder} />
        </Typography>
        <span className="vesper-select-state-indicator">
          <CaretDown className="vespers-select-state-indicator-closed" />
          <CaretUp className="vespers-select-state-indicator-open" />
        </span>
      </SelectTrigger>
      <SelectPortal container={container}>
        <SelectContent
          className="vesper-select-content"
          side="bottom"
          sideOffset={12}
          align="start"
          position="popper"
        >
          <SelectViewport className="vesper-select-viewport">
            {options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="vesper-select-item"
              >
                <Typography variant="label-md">
                  <SelectItemText>{o.label}</SelectItemText>
                </Typography>
                <span className="vesper-select-item-checkmark">
                  <Checkmark />
                </span>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  );
}
