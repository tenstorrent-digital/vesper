import { type ReactElement, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { Checkmark, Lock } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

export type MenuItemProps = {
  /** The text label displayed for the menu item. */
  text: string;
  /** An optional secondary description displayed below the text label. */
  description?: string;
  /** An optional icon element rendered to the left of the menu item text. */
  icon?: ReactNode;
  /** The visual and behavioral style of the menu item. `"locked"` and `"disabled"` both prevent interaction; `"selected"` displays a checkmark; `"locked"` displays a lock icon. Defaults to `"default"` */
  style?: "default" | "danger" | "locked" | "selected" | "disabled";
  /** Callback fired when the menu item is selected. */
  onSelect(): void;
};

export interface MenuProps {
  /** The preferred side of the trigger to render the menu against. Defaults to `"bottom"`. */
  side?: "top" | "bottom" | "left" | "right";
  /** The distance in pixels from the trigger to the menu. Defaults to `8`. */
  sideOffset?: number;
  /** The alignment of the menu relative to the trigger along the perpendicular axis. Defaults to `"start"`. */
  align?: "start" | "center" | "end";
  /** An offset in pixels from the aligned edge of the trigger. */
  alignOffset?: number;
  /** The trigger element that opens the menu. */
  children?: ReactElement;
  /** Controls the open state of the menu (controlled mode). */
  open?: boolean;
  /** Whether the menu is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(open: boolean): void;
  /** The list of menu items to render in the dropdown. */
  items: MenuItemProps[];
  /** The width of the menu dropdown in pixels. Defaults to `200`. */
  width?: number;
}

export function Menu({
  items,
  children,
  width = 200,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset,
  ...props
}: MenuProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          className="vesper-menu"
          style={{ width }}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          {items.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

function MenuItem({
  onSelect,
  text,
  description,
  icon,
  style = "default",
}: MenuItemProps) {
  return (
    <DropdownMenuItem
      disabled={style === "disabled" || style === "locked"}
      className={`vesper-menu-item vesper-menu-item-${style}`}
      onSelect={onSelect}
      textValue={text}
    >
      {icon && <div className="vesper-menu-item-left-icon">{icon}</div>}
      <div className="vesper-menu-item-text-container">
        <Typography as="span" variant="label-md-bold">
          {text}
        </Typography>
        {description && (
          <Typography
            as="span"
            variant="copy-xs"
            className="vesper-menu-item-label"
          >
            {description}
          </Typography>
        )}
      </div>
      {style === "selected" && (
        <Checkmark className="vesper-menu-item-right-icon" />
      )}
      {style === "locked" && <Lock className="vesper-menu-item-right-icon" />}
    </DropdownMenuItem>
  );
}
