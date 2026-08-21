"use client";

import {
  ComponentProps,
  Ref,
  useId,
  useImperativeHandle,
  useState,
} from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import {
  CaretDown,
  CaretUp,
  Checkmark,
  Close,
  ErrorSolid,
  InfoSolid,
  Search,
  SuccessSolid,
  WarningSolid,
} from "@/components/icons/icons";
import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/getPortalContainer";
import { useBaseRemSize } from "@/utils/useBaseRemSize";

export const COMBOBOX_SIZES = ["sm", "md", "lg"] as const;

export const COMBOBOX_VARIANTS = [
  "default",
  "warning",
  "success",
  "error",
] as const;

export type ComboboxSize = (typeof COMBOBOX_SIZES)[number];

export type ComboboxVariant = (typeof COMBOBOX_VARIANTS)[number];

const COMBOBOX_TYPOGRAPHY: Record<ComboboxSize, TypographyVariant> = {
  lg: "copy-md",
  md: "copy-sm",
  sm: "copy-xs",
};

export interface ComboboxItem {
  label: string;
  value: string;
}

export interface ComboboxProps extends Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> {
  options: (ComboboxItem | string)[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
  emptyStateText?: string;
  message?: string;
  placeholder?: string;
  label?: string;
  name?: string;
  form?: string;
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(value: boolean): void;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?(value: string | null): void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?(value: string): void;
  /** Specify the element or shadow root to portal the menu into */
  container?: PortalContainer;
  inputRef?: Ref<HTMLInputElement>;
}

export function Combobox(props: ComboboxProps) {
  const {
    options,
    disabled,
    size = "md",
    variant = "default",
    emptyStateText = "No results",
    placeholder = "Search...",
    className,
    open,
    defaultOpen,
    onOpenChange,
    value,
    defaultValue,
    onValueChange,
    inputValue,
    defaultInputValue,
    onInputValueChange,
    readOnly,
    required,
    name,
    form,
    id,
    container,
    inputRef,
    ref,
    label,
    message,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props;
  const [innerRef, setInnerRef] = useState<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => innerRef!);

  const baseRemSize = useBaseRemSize();

  const inputId = useId();

  const messageId = useId();

  // If an additional aria-describedby is supplied, this ensures that both ids get used
  const describedBy =
    [ariaDescribedby, message ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const items: ComboboxItem[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  const portalContainer = getPortalContainer(container, innerRef);

  const input = (
    <BaseCombobox.InputGroup className="vesper-combobox-input-wrapper">
      <Search className="vesper-combobox-search-icon" />
      <Typography
        as={BaseCombobox.Input}
        aria-describedby={describedBy}
        id={inputId}
        variant={COMBOBOX_TYPOGRAPHY[size]}
        placeholder={placeholder}
        className="vesper-combobox-input"
      />
      <BaseCombobox.Clear
        className="vesper-combobox-clear"
        aria-label="Clear selection"
      >
        <Close />
      </BaseCombobox.Clear>
      <BaseCombobox.Trigger
        className="vesper-combobox-trigger"
        aria-label="Show options"
      >
        <CaretUp className="vesper-combobox-caret-up" />
        <CaretDown className="vesper-combobox-caret-down" />
      </BaseCombobox.Trigger>
    </BaseCombobox.InputGroup>
  );

  return (
    <BaseCombobox.Root
      items={items}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputValueChange={onInputValueChange}
      disabled={disabled}
      required={required}
      name={name}
      form={form}
      id={id}
      inputRef={inputRef}
      readOnly={readOnly}
    >
      <div
        className={cn(
          "vesper-combobox",
          `vesper-combobox-${size}`,
          `vesper-combobox-${variant}`,
          className,
        )}
        ref={setInnerRef}
        {...rest}
      >
        {label ? (
          <div className="vesper-combobox-label-wrapper">
            <Typography
              as="label"
              variant="label-sm"
              className="vesper-combobox-label"
              htmlFor={inputId}
            >
              {label + (required ? " *" : "")}
            </Typography>
            {input}
          </div>
        ) : (
          input
        )}
        {message && (
          <p className="vesper-combobox-message">
            <span className="vesper-combobox-message-icon">
              {variant === "default" && <InfoSolid />}
              {variant === "error" && <ErrorSolid />}
              {variant === "success" && <SuccessSolid />}
              {variant === "warning" && <WarningSolid />}
            </span>
            <Typography
              id={messageId}
              as="span"
              variant="label-xs"
              className="vesper-combobox-message-text"
              aria-live="polite"
            >
              {message}
            </Typography>
          </p>
        )}
      </div>
      <BaseCombobox.Portal container={portalContainer}>
        <BaseCombobox.Positioner
          side="bottom"
          collisionAvoidance={{ side: "none" }}
          align="start"
          sideOffset={12 * (baseRemSize / 16)}
        >
          <BaseCombobox.Popup className="vesper-combobox-content">
            <BaseCombobox.Empty>
              <Typography
                className="vesper-combobox-empty-state"
                variant="label-md"
              >
                {emptyStateText}
              </Typography>
            </BaseCombobox.Empty>
            <BaseCombobox.List className="vesper-combobox-viewport">
              {(item: ComboboxItem) => (
                <BaseCombobox.Item
                  key={item.value}
                  value={item}
                  className="vesper-combobox-item"
                >
                  <Typography as="span" variant="label-md">
                    {item.label}
                  </Typography>
                  <BaseCombobox.ItemIndicator>
                    <Checkmark className="vesper-combobox-item-checkmark" />
                  </BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
