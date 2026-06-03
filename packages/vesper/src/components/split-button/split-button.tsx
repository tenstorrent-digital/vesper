import {
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
import { CaretUp } from "@/components/icon/caret-up";
import { CaretDown } from "@/components/icon/caret-down";
import { Button } from "@/components/button/button";
import { IconButton } from "@/components/icon-button/icon-button";

export interface SplitButtonProps {
  size: "lg" | "md" | "sm";
  variant: "subtle" | "contrast";
  menuItems: MenuItemProps[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  menuWidth?: MenuProps["width"];
  menuSide?: MenuProps["side"];
  menuSideOffset?: MenuProps["sideOffset"];
  menuAlign?: MenuProps["align"];
  menuAlignOffset?: MenuProps["alignOffset"];
  menuOpen?: MenuProps["open"];
  onMenuOpenChange?: MenuProps["onOpenChange"];
}

export function SplitButton({
  size,
  variant,
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
}: SplitButtonProps) {
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.target === actionButtonRef.current) e.preventDefault();
  }, []);

  return (
    <Menu
      items={menuItems}
      align={menuAlign}
      side={menuSide}
      alignOffset={menuAlignOffset}
      open={menuOpen}
      onOpenChange={onMenuOpenChange}
      sideOffset={menuSideOffset}
      width={menuWidth}
    >
      <div
        className={cn("vesper-split-button", className)}
        onPointerDown={handlePointerDown}
      >
        <Button
          ref={actionButtonRef}
          onClick={onClick}
          size={size}
          variant={variant}
        >
          {children}
        </Button>
        <IconButton
          size={size}
          variant={variant}
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
