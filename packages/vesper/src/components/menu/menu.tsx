"use client";

import { Menu as DropdownMenu } from "@base-ui/react/menu";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import {
  type ElementType,
  type ReactNode,
  type RefObject,
  useState,
} from "react";

import { Checkmark, Lock } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import {
  getPortalContainer,
  type PortalContainer,
} from "@/utils/get-portal-container";
import { useBaseRemSize } from "@/utils/hooks/use-base-rem-size";
import { Polymorphic } from "@/utils/polymorphic";

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
  onSelect: () => void;
};

export type MenuProps<E extends ElementType = "button"> = Polymorphic<
  {
    /** The preferred side of the trigger to render the menu against. @default bottom */
    side?: "top" | "bottom" | "left" | "right";
    /** The distance in pixels from the trigger to the menu. @default 8 */
    sideOffset?: number;
    /** The alignment of the menu relative to the trigger along the perpendicular axis. @default start */
    align?: "start" | "center" | "end";
    /** An offset in pixels from the aligned edge of the trigger. @default 0 */
    alignOffset?: number;
    /** The content of the trigger. */
    children?: ReactNode;
    /** Controls the open state of the menu (controlled mode). */
    open?: boolean;
    /** Whether the menu is open by default (uncontrolled mode). */
    defaultOpen?: boolean;
    /** Callback fired when the open state changes. Receives the new open state as an argument. */
    onOpenChange?: (open: boolean) => void;
    /** The list of menu items to render in the dropdown. */
    items: MenuItemProps[];
    /** The width of the menu dropdown in pixels. @default 200 */
    width?: number;
    /** Specify the element or shadow root to portal the menu into */
    container?: PortalContainer;
    /** Specify the element to anchor the menu against. @default trigger element */
    anchor?: HTMLElement | null | RefObject<HTMLElement | null>;
  },
  E,
  "button"
>;

/**
 * A dropdown menu component triggered by a child element, rendering a list of selectable menu items.
 *
 * @param {MenuItemProps[]} props.items - The list of menu items to render in the dropdown
 * @param {ReactNode} [props.children] - (optional) The content of the trigger that opens the menu
 * @param {number} [props.width] - (optional) The width of the dropdown in pixels. @default 200
 * @param {"top" | "bottom" | "left" | "right"} [props.side] - (optional) The preferred side of the trigger. @default bottom
 * @param {number} [props.sideOffset] - (optional) Distance in pixels from the trigger. @default 8
 * @param {"start" | "center" | "end"} [props.align] - (optional) Alignment relative to the trigger. @default start
 * @param {PortalContainer} [props.container] - (optional) Specify the element or shadow root to portal the menu into
 * @param {boolean} [props.open] - (optional) Controls the open state (controlled)
 * @param {(open: boolean) => void} [props.onOpenChange] - (optional) Callback fired when the open state changes
 *
 * @example
 * <Menu
 *   as={IconButton}
 *   icon={<Ellipses />}
 *   aria-label="Actions"
 *   items={[
 *     { text: "Edit", onSelect: handleEdit },
 *     { text: "Delete", style: "danger", onSelect: handleDelete },
 *   ]}
 * />
 *
 * @example
 * <Menu
 *   as={Button}
 *   variant="ghost"
 *   items={options}
 *   side="right"
 *   width={250}
 *   align="end"
 * />
 */
export function Menu<E extends ElementType = "button">(props: MenuProps<E>) {
  const {
    items,
    width = 200,
    side = "bottom",
    sideOffset = 8,
    align = "start",
    alignOffset = 0,
    container,
    anchor,
    defaultOpen,
    onOpenChange,
    open,
    ref,
    as: Component = "button",
    ...rest
  } = props;

  const [innerRef, setInnerRef] = useState<Element | null>(null);
  const mergedRef = useMergedRefs(ref, setInnerRef);
  const triggerRef = (e: HTMLButtonElement | null) => mergedRef?.(e);

  const baseRemSize = useBaseRemSize();

  const portalContainer = getPortalContainer(container, innerRef);

  return (
    <DropdownMenu.Root
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <DropdownMenu.Trigger ref={triggerRef} render={<Component {...rest} />} />
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
              // menu items have no unique id and are rendered in a static order
              // oxlint-disable-next-line react/no-array-index-key
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
