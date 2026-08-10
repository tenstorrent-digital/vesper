"use client";

import { ComponentProps, ReactNode } from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { isSingleReactElement } from "@/utils/isSingleReactElement";

export const TABS_VARIANTS = ["primary", "secondary"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];

export interface TabsProps extends Omit<
  ComponentProps<"div">,
  "children" | "dir"
> {
  /** The visual style variant of the tabs. @default primary */
  variant?: TabsVariant;
  /** The list of tab items to render. Each item defines a tab trigger and its associated content panel. */
  items: {
    /** The text label displayed in the tab trigger. */
    label: string;
    /** A unique value identifying this tab, used for selection tracking. */
    value: string;
    /** An optional icon element rendered before the label in the tab trigger. */
    icon?: ReactNode;
    /** The content rendered in the panel when this tab is active. */
    content: ReactNode;
  }[];
  /** The value for the selected tab (controlled). */
  value?: string;
  /** The value of the tab to select by default (uncontrolled). */
  defaultValue?: string;
  /** Callback fired when when a new tab is selected */
  onValueChange?: (value: string) => void;
  /** Whether a tab is activated automatically (when receiving focus) or manually (when clicked). @default automatic */
  activationMode?: "automatic" | "manual";
}

const TRIGGER_TYPOGRAPHY: { [V in TabsVariant]: TypographyVariant } = {
  primary: "label-md",
  secondary: "label-sm",
};

/**
 * A tabbed interface component for organizing content into switchable panels.
 *
 * @param {TabsProps["items"]} props.items - The list of tab items defining triggers and content panels
 * @param {TabsVariant} [props.variant] - (optional) The visual style variant of the tabs. @default primary
 * @param {string} [props.value] - (optional) The selected tab value (controlled)
 * @param {string} [props.defaultValue] - (optional) The tab to select by default (uncontrolled)
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback fired when a new tab is selected
 * @param {"automatic" | "manual"} [props.activationMode] - (optional) Tab activation mode. @default automatic
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <Tabs
 *   items={[
 *     { value: "overview", label: "Overview", content: <Overview /> },
 *     { value: "settings", label: "Settings", content: <Settings /> },
 *   ]}
 *   defaultValue="overview"
 * />
 *
 * @example
 * <Tabs
 *   variant="secondary"
 *   items={[
 *     { value: "code", label: "Code", icon: <Document />, content: <CodePanel /> },
 *     { value: "preview", label: "Preview", content: <PreviewPanel /> },
 *   ]}
 *   value={activeTab}
 *   onValueChange={setActiveTab}
 * />
 */
export function Tabs(props: TabsProps) {
  const {
    items,
    className,
    variant = "primary",
    activationMode = "manual",
    onValueChange,
    ...rest
  } = props;

  return (
    <BaseTabs.Root
      className={cn(`vesper-tabs-${variant}`, className)}
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    >
      <BaseTabs.List
        activateOnFocus={activationMode === "automatic"}
        className="vesper-tabs-list"
      >
        {items.map((item) => (
          <Typography
            as={BaseTabs.Tab}
            variant={TRIGGER_TYPOGRAPHY[variant]}
            key={item.value}
            value={item.value}
            className="vesper-tabs-trigger"
          >
            {item.icon && (
              <span className="vesper-tabs-trigger-icon">{item.icon}</span>
            )}
            {item.label}
          </Typography>
        ))}
      </BaseTabs.List>
      {items.map((item) => {
        const children = isSingleReactElement(item.content) ? (
          item.content
        ) : (
          <span>{item.content}</span>
        );

        return (
          <BaseTabs.Panel
            render={children}
            key={item.value}
            value={item.value}
          />
        );
      })}
    </BaseTabs.Root>
  );
}
