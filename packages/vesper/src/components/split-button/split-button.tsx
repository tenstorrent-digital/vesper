"use client";

import {
  ComponentProps,
  type MouseEventHandler,
  type PointerEvent,
  useCallback,
  useRef,
} from "react";

import { Button } from "@/components/button/button";
import { IconButton } from "@/components/icon-button/icon-button";
import { CaretDown, CaretUp } from "@/components/icons/icons";
import {
  Menu,
  type MenuItemProps,
  type MenuProps,
} from "@/components/menu/menu";

import { cn } from "@/utils/cn";

export const SPLIT_BUTTON_SIZES = ["sm", "md", "lg"] as const;

export const SPLIT_BUTTON_VARIANTS = ["subtle", "contrast"] as const;

export type SplitButtonSize = (typeof SPLIT_BUTTON_SIZES)[number];

export type SplitButtonVariant = (typeof SPLIT_BUTTON_VARIANTS)[number];

export interface SplitButtonProps extends Omit<
  ComponentProps<"div">,
  "onClick"
> {
  /** The size of the split button, applied to both the action button and the menu toggle. @default lg */
  size?: SplitButtonSize;
  /** The visual style variant, applied to both the action button and the menu toggle. @default contrast */
  variant?: SplitButtonVariant;
  /** The list of menu items rendered in the dropdown when the menu toggle is clicked. */
  menuItems: MenuItemProps[];
  /** Callback fired when the primary action button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** An accessible `aria-label` for the menu toggle button. @default Toggle menu */
  menuButtonAriaLabel?: string;
  /** The width of the dropdown menu in pixels. @default 200 */
  menuWidth?: MenuProps["width"];
  /** The preferred side of the split button to render the dropdown menu against. @default bottom */
  menuSide?: MenuProps["side"];
  /** The distance in pixels from the split button to the dropdown menu. @default 8 */
  menuSideOffset?: MenuProps["sideOffset"];
  /** The alignment of the dropdown menu relative to the split button. @default start */
  menuAlign?: MenuProps["align"];
  /** An offset in pixels from the aligned edge of the split button. @default 0 */
  menuAlignOffset?: MenuProps["alignOffset"];
  /** Controls the open state of the dropdown menu (controlled mode). */
  menuOpen?: MenuProps["open"];
  /** Callback fired when the dropdown menu's open state changes. */
  onMenuOpenChange?: MenuProps["onOpenChange"];
  /** Whether the dropdown menu is open by default (uncontrolled mode). */
  defaultMenuOpen?: MenuProps["defaultOpen"];
  /** When `true`, disables both the action button and the menu toggle, preventing interaction. @default false */
  disabled?: boolean;
}

/**
 * A compound button that pairs a primary action button with a dropdown menu toggle for secondary actions.
 *
 * @param {MenuItemProps[]} props.menuItems - The list of menu items rendered in the dropdown
 * @param {SplitButtonSize} [props.size] - (optional) The size of the split button. @default lg
 * @param {SplitButtonVariant} [props.variant] - (optional) The visual style variant. @default contrast
 * @param {MouseEventHandler<HTMLButtonElement>} [props.onClick] - (optional) Callback fired when the primary action button is clicked
 * @param {boolean} [props.disabled] - (optional) Disables both the action button and the menu toggle. @default false
 * @param {string} [props.menuButtonAriaLabel] - (optional) Accessible label for the menu toggle. @default Toggle menu
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <SplitButton
 *   onClick={handleSave}
 *   menuItems={[
 *     { text: "Save as draft", onSelect: handleDraft },
 *     { text: "Save and publish", onSelect: handlePublish },
 *   ]}
 * >
 *   Save
 * </SplitButton>
 *
 * @example
 * <SplitButton
 *   size="sm"
 *   variant="subtle"
 *   menuItems={exportOptions}
 *   menuSide="top"
 *   onClick={handleExport}
 * >
 *   Export
 * </SplitButton>
 */
export function SplitButton(props: SplitButtonProps) {
  const {
    size = "lg",
    variant = "contrast",
    children,
    className,
    onClick,
    menuItems = [],
    menuAlign = "start",
    menuAlignOffset,
    menuOpen,
    onMenuOpenChange,
    menuSide = "bottom",
    menuSideOffset,
    menuWidth,
    disabled = false,
    menuButtonAriaLabel,
    onPointerDown,
    defaultMenuOpen,
    ...rest
  } = props;

  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || actionButtonRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
      onPointerDown?.(e);
    },
    [disabled, onPointerDown],
  );

  const handleOpenMenuChange = useCallback(
    (open: boolean) => {
      if (!open) menuButtonRef.current?.focus();
      onMenuOpenChange?.(open);
    },
    [onMenuOpenChange],
  );

  return (
    <Menu
      items={menuItems}
      align={menuAlign}
      side={menuSide}
      alignOffset={menuAlignOffset}
      open={menuOpen}
      onOpenChange={handleOpenMenuChange}
      sideOffset={menuSideOffset}
      width={menuWidth}
      defaultOpen={defaultMenuOpen}
    >
      <div
        className={cn("vesper-split-button", className)}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <Button
          ref={actionButtonRef}
          onClick={onClick}
          onKeyDown={(e) => e.stopPropagation()}
          size={size}
          variant={variant}
          disabled={disabled}
        >
          {children}
        </Button>
        <IconButton
          size={size}
          variant={variant}
          disabled={disabled}
          aria-label={menuButtonAriaLabel || "Toggle menu"}
          ref={menuButtonRef}
          icon={
            <>
              <CaretDown className="vesper-split-button-caret-down" />
              <CaretUp className="vesper-split-button-caret-up" />
            </>
          }
        />
      </div>
    </Menu>
  );
}
