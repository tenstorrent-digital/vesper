import {
  ComponentProps,
  type MouseEventHandler,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/utils/cn";
import {
  Menu,
  type MenuProps,
  type MenuItemProps,
} from "@/components/menu/menu";
import { CaretDown, CaretUp } from "@/components/icons/icons";
import { Button } from "@/components/button/button";
import { IconButton } from "@/components/icon-button/icon-button";

export const SPLIT_BUTTON_SIZES = ["lg", "md", "sm"] as const;

export const SPLIT_BUTTON_VARIANTS = ["subtle", "contrast"] as const;

export type SplitButtonSize = (typeof SPLIT_BUTTON_SIZES)[number];

export type SplitButtonVariant = (typeof SPLIT_BUTTON_VARIANTS)[number];

export interface SplitButtonProps extends ComponentProps<"div"> {
  size?: SplitButtonSize;
  variant?: SplitButtonVariant;
  menuItems: MenuItemProps[];
  onClickActionButton?: MouseEventHandler<HTMLButtonElement>;
  menuButtonAriaLabel?: string;
  children?: ReactNode;
  className?: string;
  menuWidth?: MenuProps["width"];
  menuSide?: MenuProps["side"];
  menuSideOffset?: MenuProps["sideOffset"];
  menuAlign?: MenuProps["align"];
  menuAlignOffset?: MenuProps["alignOffset"];
  menuOpen?: MenuProps["open"];
  onMenuOpenChange?: MenuProps["onOpenChange"];
  defaultMenuOpen?: MenuProps["defaultOpen"];
  disabled?: boolean;
}

export function SplitButton({
  size = "lg",
  variant = "contrast",
  children,
  className,
  onClickActionButton,
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
          onClick={onClickActionButton}
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
