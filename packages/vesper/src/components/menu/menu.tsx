"use client";

import { type ReactNode, RefObject, useState } from "react";
import { Menu as DropdownMenu } from "@base-ui/react/menu";

import { Checkmark, Lock } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/getPortalContainer";
import { isSingleReactElement } from "@/utils/isSingleReactElement";
import { useBaseRemSize } from "@/utils/useBaseRemSize";

export type MenuItemProps = {
  /** The text label displayed for the menu item. */
  text: string;
  /** An optional secondary description displayed below the text label. */
  description?: string;
  /** An optional icon element rendered to the left of the menu item text. */
  icon?: ReactNode;
  /** The visual and behavioral style of the menu item. `"locked"` and `"disabled"` both prevent interaction; `"selected"` displays a checkmark; `"locked"` displays a lock icon. @default default */
  style?: "default" | "danger" | "locked" | "selected" | "disabled";
  /** Callback fired when the menu item is selected. */
  onSelect(): void;
};

export interface MenuProps {
  /** The preferred side of the trigger to render the menu against. @default bottom */
  side?: "top" | "bottom" | "left" | "right";
  /** The distance in pixels from the trigger to the menu. @default 8 */
  sideOffset?: number;
  /** The alignment of the menu relative to the trigger along the perpendicular axis. @default start */
  align?: "start" | "center" | "end";
  /** An offset in pixels from the aligned edge of the trigger. @default 0 */
  alignOffset?: number;
  /** The trigger element that opens the menu. */
  children?: ReactNode;
  /** Controls the open state of the menu (controlled mode). */
  open?: boolean;
  /** Whether the menu is open by default (uncontrolled mode). */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. Receives the new open state as an argument. */
  onOpenChange?(open: boolean): void;
  /** The list of menu items to render in the dropdown. */
  items: MenuItemProps[];
  /** The width of the menu dropdown in pixels. @default 200 */
  width?: number;
  /** Specify the element or document fragment to portal the menu into */
  container?: PortalContainer;
  /** Specify the element to anchor the menu against. @default trigger element */
  anchor?: HTMLElement | RefObject<HTMLElement | null>;
}

/**
 * A dropdown menu component triggered by a child element, rendering a list of selectable menu items.
 *
 * @param {MenuItemProps[]} props.items - The list of menu items to render in the dropdown
 * @param {ReactElement} [props.children] - (optional) The trigger element that opens the menu
 * @param {number} [props.width] - (optional) The width of the dropdown in pixels. @default 200
 * @param {"top" | "bottom" | "left" | "right"} [props.side] - (optional) The preferred side of the trigger. @default bottom
 * @param {number} [props.sideOffset] - (optional) Distance in pixels from the trigger. @default 8
 * @param {"start" | "center" | "end"} [props.align] - (optional) Alignment relative to the trigger. @default start
 * @param {PortalContainer} [props.container] - (optional) Specify the element or document fragment to portal the menu into
 * @param {boolean} [props.open] - (optional) Controls the open state (controlled)
 * @param {(open: boolean) => void} [props.onOpenChange] - (optional) Callback fired when the open state changes
 *
 * @example
 * <Menu
 *   items={[
 *     { text: "Edit", onSelect: handleEdit },
 *     { text: "Delete", style: "danger", onSelect: handleDelete },
 *   ]}
 * >
 *   <IconButton icon={<Ellipses />} aria-label="Actions" />
 * </Menu>
 *
 * @example
 * <Menu
 *   items={options}
 *   side="right"
 *   width={250}
 *   align="end"
 * >
 *   <Button variant="ghost">Options</Button>
 * </Menu>
 */
export function Menu(props: MenuProps) {
  const {
    items,
    children,
    width = 200,
    side = "bottom",
    sideOffset = 8,
    align = "start",
    alignOffset = 0,
    container,
    anchor,
    ...rest
  } = props;

  const [ref, setRef] = useState<Element | null>(null);

  const baseRemSize = useBaseRemSize();

  const portalContainer = getPortalContainer(container, ref);

  if (!isSingleReactElement(children)) {
    return children;
  }

  return (
    <DropdownMenu.Root {...rest}>
      <DropdownMenu.Trigger render={children} ref={setRef} />
      <DropdownMenu.Portal container={portalContainer}>
        <DropdownMenu.Positioner
          anchor={anchor}
          side={side}
          sideOffset={sideOffset * (baseRemSize / 16)}
          align={align}
          alignOffset={alignOffset * (baseRemSize / 16)}
        >
          <DropdownMenu.Popup
            className="vesper-menu"
            style={{ width: `calc(${width} * (1rem / 16))` }}
          >
            {items.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </DropdownMenu.Popup>
        </DropdownMenu.Positioner>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
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
    <DropdownMenu.Item
      disabled={style === "disabled" || style === "locked"}
      className={`vesper-menu-item vesper-menu-item-${style}`}
      onClick={() => onSelect()}
      label={text}
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
    </DropdownMenu.Item>
  );
}
