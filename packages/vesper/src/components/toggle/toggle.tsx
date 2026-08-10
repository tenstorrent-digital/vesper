"use client";

import {
  type ComponentProps,
  FocusEvent,
  KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  Typography,
  type TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const TOGGLE_SIZES = ["sm", "md", "lg"] as const;

export type ToggleSize = (typeof TOGGLE_SIZES)[number];

export type ToggleOption =
  | {
      /** A unique value identifying this toggle option. */
      value: string;
      /** The text label displayed in the toggle option. */
      text: string;
      /** An optional accessible `aria-label` for the toggle option. */
      ariaLabel?: string;
    }
  | {
      /** A unique value identifying this toggle option. */
      value: string;
      /** An icon element displayed in place of text for the toggle option. */
      icon: ReactNode;
      /** A required accessible `aria-label` for icon-only toggle options. */
      ariaLabel: string;
    };

export interface ToggleProps extends Omit<
  ComponentProps<"div">,
  "children" | "dir"
> {
  /** The list of toggle options to render. Each option can display either text or an icon. */
  options: ToggleOption[];
  /** The size of the toggle and its options. Affects padding and typography. @default md */
  size?: ToggleSize;
  /** The currently selected value (controlled mode). */
  value?: string;
  /** The initially selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. Receives the newly selected value. */
  onValueChange?(value: string): void;
  /** When `true`, disables all toggle options, preventing interaction. @default false */
  disabled?: boolean;
  /** The name of the underlying select, used as the field name when submitted with form data. */
  name?: string;
  /** When `true`, makes the underlying input required when rendered inside of a form. @default false */
  required?: boolean;
}

const TOGGLE_TYPOGRAPHY: { [S in ToggleSize]: TypographyVariant } = {
  sm: "label-sm",
  md: "label-sm",
  lg: "label-lg",
};

/**
 * A segmented control component for selecting one option from a group of text or icon options.
 *
 * Unlike `Checkbox` (which handles individual boolean selections and indeterminate state) and `Switch` (which presents a binary on/off toggle as a sliding pill), `Toggle` allows selecting one value from a set of mutually exclusive options. For usage in forms, you probably want to use either `Checkbox` or `Switch` instead.
 *
 * @see packages/vesper/src/components/checkbox/checkbox.tsx
 * @see packages/vesper/src/components/switch/switch.tsx
 *
 * @param {ToggleOption[]} props.options - The list of toggle options to render
 * @param {ToggleSize} [props.size] - (optional) The size of the toggle. @default md
 * @param {string} [props.value] - (optional) The currently selected value (controlled)
 * @param {string} [props.defaultValue] - (optional) The initially selected value (uncontrolled)
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback fired when the selected value changes
 * @param {boolean} [props.disabled] - (optional) Disables all toggle options. @default false
 * @param {string} [props.name] - (optional) Form field name submitted with form data
 * @param {boolean} [props.required] - (optional) Marks the toggle as required for form validation. @default false
 *
 * While an option is focused, `ArrowLeft`/`ArrowRight` move focus between options, looping around at either end of the list. The group exposes a single tab stop (roving tabindex): `Tab` moves focus to the selected option, or to the first option when nothing is selected.
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Toggle
 *   options={[
 *     { value: "grid", icon: <Grid />, ariaLabel: "Grid view" },
 *     { value: "list", icon: <List />, ariaLabel: "List view" },
 *   ]}
 *   value={view}
 *   onValueChange={setView}
 * />
 *
 * @example
 * <Toggle
 *   size="sm"
 *   options={[
 *     { value: "day", text: "Day" },
 *     { value: "week", text: "Week" },
 *     { value: "month", text: "Month" },
 *   ]}
 *   defaultValue="week"
 * />
 */
export function Toggle(props: ToggleProps) {
  const {
    options,
    className,
    size = "md",
    value,
    defaultValue,
    onValueChange,
    id,
    name,
    required,
    disabled,
    ref,
    onKeyDown,
    ...rest
  } = props;

  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current!);

  /**
   * whether the toggle is controlled is latched on the first render: `value`
   * legitimately becomes `undefined` when the active option is deselected, so
   * it can't be used to derive controlled-ness on subsequent renders
   */
  const isControlled = useRef(value !== undefined);
  const [innerValue, setInnerValue] = useState(value ?? defaultValue);

  useEffect(() => {
    if (!isControlled.current) return;
    setInnerValue(value);
  }, [value]);

  const handleChangeValue = useCallback(
    (nextValue: string) => {
      setInnerValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange],
  );

  // update inner value when parent form resets
  useEffect(() => {
    const form = innerRef.current?.closest("form");
    if (!form) return;

    const handleReset = () => {
      handleChangeValue(defaultValue ?? "");
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [defaultValue, handleChangeValue]);

  /**
   * Mimic the keyboard accessibility of a group of radio inputs
   * - ArrowRight moves focus forwards to the next option
   * - ArrowLeft moves focus back to the previous option
   * - disabled options are skipped
   * - moving forwards/back at the last/first option loops around
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (
        e.defaultPrevented ||
        (e.key !== "ArrowLeft" &&
          e.key !== "ArrowRight" &&
          e.key !== "ArrowUp" &&
          e.key !== "ArrowDown")
      ) {
        return;
      }

      const items = Array.from(
        innerRef.current!.querySelectorAll<HTMLButtonElement>(
          ".vesper-toggle-item:not(:disabled)",
        ),
      );

      const currentIndex = items.indexOf(e.target as HTMLButtonElement);
      if (currentIndex === -1) return;

      e.preventDefault();

      const direction =
        e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;

      const nextIndex =
        (currentIndex + direction + items.length) % items.length;

      items[nextIndex]?.focus();
    },
    [onKeyDown],
  );

  const [focusedValue, setFocusedValue] = useState<string | undefined>(
    undefined,
  );
  const focusedIndex = options.findIndex((o) => o.value === focusedValue);
  const selectedIndex = options.findIndex((o) => o.value === innerValue);

  /**
   * roving tabindex: the group only ever exposes a single tab stop, which
   * follows focus within the group, falling back to the selected option and
   * finally to the first option when nothing is selected
   */
  const tabbableIndex =
    [focusedIndex, selectedIndex].find((i) => i !== -1) ?? 0;

  return (
    <div
      ref={innerRef}
      role="radiogroup"
      aria-required={required}
      className={cn(
        "vesper-toggle",
        `vesper-toggle-${size}`,
        disabled && "vesper-toggle-disabled",
        className,
      )}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <select
        aria-hidden
        tabIndex={-1}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        className="vesper-toggle-select"
        onChange={(event) => handleChangeValue(event.target.value)}
        value={innerValue ?? ""}
      >
        {/**
         * an empty placeholder label option must come first so that the select
         * can represent "no selection" without falling back to the first
         * option, and so that `required` can fail form validation
         */}
        <option value="" />
        {options.map((option) => (
          <option key={option.value} value={option.value} />
        ))}
      </select>
      {options.map((option, index) => {
        const isSelected = innerValue === option.value;

        return (
          <Typography
            as="button"
            type="button"
            aria-checked={isSelected}
            role="radio"
            tabIndex={index === tabbableIndex ? 0 : -1}
            disabled={disabled}
            variant={TOGGLE_TYPOGRAPHY[size]}
            key={option.value}
            className={cn(
              "vesper-toggle-item",
              isSelected && "vesper-toggle-item-active",
            )}
            aria-label={option.ariaLabel}
            onFocus={() => setFocusedValue(option.value)}
            onClick={() => handleChangeValue(isSelected ? "" : option.value)}
          >
            {"text" in option ? (
              option.text
            ) : (
              <span className="vesper-toggle-icon">{option.icon}</span>
            )}
          </Typography>
        );
      })}
    </div>
  );
}
