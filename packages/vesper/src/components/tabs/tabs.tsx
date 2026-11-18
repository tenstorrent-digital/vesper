"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from "react";

import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";
import { cn } from "@/utils/cn";

export const TABS_VARIANTS = ["primary", "secondary"] as const;

export const TABS_ACTIVATION_MODES = ["manual", "automatic"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];

export type TabsActivationMode = (typeof TABS_ACTIVATION_MODES)[number];

export interface TabsProps extends Omit<ComponentProps<"div">, "dir"> {
  /** The visual style variant of the tabs. @default primary */
  variant?: TabsVariant;
  /** The value for the selected tab (controlled). */
  value?: string;
  /** The value of the tab to select by default (uncontrolled). */
  defaultValue?: string;
  /** Callback fired when when a new tab is selected */
  onValueChange?: (value: string) => void;
  /** Whether a tab is activated automatically (when receiving focus) or manually (when clicked). @default automatic */
  activationMode?: TabsActivationMode;
}

const TRIGGER_TYPOGRAPHY: { [V in TabsVariant]: TypographyVariant } = {
  primary: "label-md",
  secondary: "label-sm",
};

const TabsContext = createContext<{
  activationMode: TabsActivationMode;
  variant: TabsVariant;
} | null>(null);

const useTabsContext = (componentName: string, parentName: string) => {
  const value = useContext(TabsContext);
  if (value === null) {
    throw new Error(`${componentName} must be rendered within ${parentName}`);
  }
  return value;
};

/**
 * A tabbed interface component for organizing content into switchable panels.
 *
 * @param {readonly TabItem[]} props.items - The list of tab items defining triggers and content panels. Set `contentAsPanel` on an item to render its `content` as the panel itself, forwarding the panel's props (including `ref`) to `content`
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
 *
 * @example
 * // renders `Material` as the "usage" tab's panel itself
 * <Tabs
 *   items={[
 *     {
 *       value: "usage",
 *       label: "Usage",
 *       contentAsPanel: true,
 *       content: <Material as="section">{usage}</Material>,
 *     },
 *   ]}
 * />
 */
export function TabsRoot(props: TabsProps) {
  const {
    className,
    variant = "primary",
    activationMode = "automatic",
    onValueChange,
    children,
    ...rest
  } = props;

  const contextValue = useMemo(
    () => ({ activationMode, variant }),
    [activationMode, variant],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <BaseTabs.Root
        className={cn(`vesper-tabs-${variant}`, className)}
        onValueChange={(value) => onValueChange?.(value)}
        {...rest}
      >
        {children}
      </BaseTabs.Root>
    </TabsContext.Provider>
  );
}

export type TabsListProps = ComponentProps<"div">;

export function TabsList(props: ComponentProps<"div">) {
  const { activationMode } = useTabsContext("TabsList", "TabsRoot");
  const { className, ...rest } = props;

  return (
    <BaseTabs.List
      {...rest}
      activateOnFocus={activationMode === "automatic"}
      className={cn("vesper-tabs-list", className)}
    />
  );
}

export interface TabTriggerProps extends Omit<
  ComponentProps<"button">,
  "children"
> {
  /** The value of the Tab represented by this trigger */
  value: string;
  /** The text label displayed in the tab trigger. */
  label: string;
  /** An optional icon element rendered before the label in the tab trigger. */
  icon?: ReactNode;
}

export function TabTrigger(props: TabTriggerProps) {
  const { value, icon, label, className, ...rest } = props;
  const { variant } = useTabsContext("TabTrigger", "TabsList");

  return (
    <BaseTabs.Tab
      {...rest}
      value={value}
      className={cn("vesper-tabs-trigger", className)}
    >
      {icon && <span className="vesper-tabs-trigger-icon">{icon}</span>}
      <Typography
        as="span"
        variant={TRIGGER_TYPOGRAPHY[variant]}
        className="vesper-tabs-trigger-label"
      >
        {label}
      </Typography>
    </BaseTabs.Tab>
  );
}

export interface TabPanelProps extends ComponentProps<"div"> {
  /** The value of the TabPanel. It will be shown when the Tab with the corresponding value is active */
  value: string;
  /** Whether to keep the HTML element in the DOM while the panel is hidden. @default false */
  keepMounted?: boolean;
}

export function TabPanel(props: TabPanelProps) {
  useTabsContext("TabPanel", "TabsRoot");
  const { value, ...rest } = props;

  return <BaseTabs.Panel {...rest} value={value} />;
}
