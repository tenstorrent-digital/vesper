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
  /** The size of the split button, applied to both the action button and the menu toggle. Defaults to `"lg"`. */
  size?: SplitButtonSize;
  /** The visual style variant, applied to both the action button and the menu toggle. Defaults to `"contrast"`. */
  variant?: SplitButtonVariant;
  /** The list of menu items rendered in the dropdown when the menu toggle is clicked. */
  menuItems: MenuItemProps[];
  /** Callback fired when the primary action button is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** An accessible `aria-label` for the menu toggle button. Defaults to `"Toggle menu"`. */
  menuButtonAriaLabel?: string;
  /** The width of the dropdown menu in pixels. Defaults to `200`. */
  menuWidth?: MenuProps["width"];
  /** The preferred side of the split button to render the dropdown menu against. Defaults to `"bottom"`. */
  menuSide?: MenuProps["side"];
  /** The distance in pixels from the split button to the dropdown menu. Defaults to `8`. */
  menuSideOffset?: MenuProps["sideOffset"];
  /** The alignment of the dropdown menu relative to the split button. Defaults to `"start"`. */
  menuAlign?: MenuProps["align"];
  /** An offset in pixels from the aligned edge of the split button. */
  menuAlignOffset?: MenuProps["alignOffset"];
  /** Controls the open state of the dropdown menu (controlled mode). */
  menuOpen?: MenuProps["open"];
  /** Callback fired when the dropdown menu's open state changes. */
  onMenuOpenChange?: MenuProps["onOpenChange"];
  /** Whether the dropdown menu is open by default (uncontrolled mode). */
  defaultMenuOpen?: MenuProps["defaultOpen"];
  /** When `true`, disables both the action button and the menu toggle, preventing interaction. */
  disabled?: boolean;
}

/**
 * A button split into a primary action and a dropdown menu toggle.
 * Clicking the main area triggers the primary action; clicking the caret opens a menu.
 *
 * @example
 * <SplitButton
 *   onClick={handleDeploy}
 *   menuItems={[
 *     { text: "Deploy to staging", onSelect: handleSelectStaging },
 *     { text: "Deploy to production", onSelect: handleSelectProduction },
 *   ]}
 * >
 *   Deploy
 * </SplitButton>
 */
export function SplitButton({
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
  disabled,
  menuButtonAriaLabel,
  onPointerDown,
  defaultMenuOpen,
  ...props
}: SplitButtonProps) {
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
        {...props}
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
