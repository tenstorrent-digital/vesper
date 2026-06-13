import { type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  type DropdownMenuProps,
  DropdownMenuContentProps,
} from "@radix-ui/react-dropdown-menu";
import { Checkmark, Lock } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

export type MenuItemProps = {
  text: string;
  description?: string;
  icon?: ReactNode;
  style?: "default" | "danger" | "locked" | "selected" | "disabled";
  onSelect(): void;
};

export interface MenuProps
  extends
    DropdownMenuProps,
    Pick<
      DropdownMenuContentProps,
      "side" | "sideOffset" | "align" | "alignOffset"
    > {
  items: MenuItemProps[];
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
        <Typography as="span" variant="label" size="md" bold>
          {text}
        </Typography>
        {description && (
          <Typography
            as="span"
            variant="copy"
            size="xs"
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
