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
  /** Callback fired when a new tab is selected */
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
 * The root of a tabbed interface, which groups a `TabsList` with the `TabPanel`s it controls and tracks the selected tab.
 *
 * @param {TabsVariant} [props.variant] - (optional) The visual style variant of the tabs. @default primary
 * @param {string} [props.value] - (optional) The selected tab value (controlled)
 * @param {string} [props.defaultValue] - (optional) The tab to select by default (uncontrolled)
 * @param {(value: string) => void} [props.onValueChange] - (optional) Callback fired when a new tab is selected
 * @param {TabsActivationMode} [props.activationMode] - (optional) Whether a tab is selected when its trigger receives focus (`automatic`) or only when it is clicked (`manual`). @default automatic
 * @param {ReactNode} [props.children] - (optional) A `TabsList` and the `TabPanel`s it controls
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <TabsRoot defaultValue="overview">
 *   <TabsList>
 *     <TabTrigger value="overview" label="Overview" />
 *     <TabTrigger value="settings" label="Settings" />
 *   </TabsList>
 *   <TabPanel value="overview">
 *     <Overview />
 *   </TabPanel>
 *   <TabPanel value="settings">
 *     <Settings />
 *   </TabPanel>
 * </TabsRoot>
 *
 * @example
 * <TabsRoot variant="secondary" value={activeTab} onValueChange={setActiveTab}>
 *   <TabsList>
 *     <TabTrigger value="code" label="Code" icon={<Document />} />
 *     <TabTrigger value="preview" label="Preview" />
 *   </TabsList>
 *   <TabPanel value="code">
 *     <CodePanel />
 *   </TabPanel>
 *   <TabPanel value="preview">
 *     <PreviewPanel />
 *   </TabPanel>
 * </TabsRoot>
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
        className={cn("vesper-tabs", `vesper-tabs-${variant}`, className)}
        onValueChange={(value) => onValueChange?.(value)}
        {...rest}
      >
        {children}
      </BaseTabs.Root>
    </TabsContext.Provider>
  );
}

export type TabsListProps = ComponentProps<"div">;

/**
 * Contains the `TabTrigger`s of a tabbed interface, and must be rendered within `TabsRoot`.
 *
 * @param {ReactNode} [props.children] - (optional) The `TabTrigger`s to render, in the order they are displayed
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <TabsList>
 *   <TabTrigger value="overview" label="Overview" />
 *   <TabTrigger value="settings" label="Settings" />
 * </TabsList>
 */
export function TabsList(props: ComponentProps<"div">) {
  const { activationMode, variant } = useTabsContext("TabsList", "TabsRoot");
  const { className, ...rest } = props;

  return (
    <BaseTabs.List
      {...rest}
      activateOnFocus={activationMode === "automatic"}
      className={cn(
        "vesper-tabs-list",
        `vesper-tabs-list-${variant}`,
        className,
      )}
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

/**
 * A button that selects the `TabPanel` sharing its `value`, and must be rendered within `TabsList`.
 *
 * @param {string} props.value - The value of the tab this trigger selects
 * @param {string} props.label - The text label displayed in the trigger
 * @param {ReactNode} [props.icon] - (optional) An icon element rendered before the label
 *
 * You may also pass any additional props (except `children`) to the underlying `button` element
 *
 * @example
 * <TabTrigger value="overview" label="Overview" />
 *
 * @example
 * <TabTrigger value="settings" label="Settings" icon={<Gear />} />
 */
export function TabTrigger(props: TabTriggerProps) {
  const { value, icon, label, className, ...rest } = props;
  const { variant } = useTabsContext("TabTrigger", "TabsList");

  return (
    <BaseTabs.Tab
      {...rest}
      value={value}
      className={cn(
        "vesper-tabs-trigger",
        `vesper-tabs-trigger-${variant}`,
        className,
      )}
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

/**
 * The content shown while the `TabTrigger` sharing its `value` is selected, which must be rendered within `TabsRoot`.
 *
 * @param {string} props.value - The value of the tab this panel belongs to
 * @param {boolean} [props.keepMounted] - (optional) Whether to keep the panel in the DOM while it is hidden. @default false
 * @param {ReactNode} [props.children] - (optional) The content of the panel
 *
 * You may also pass any additional props to the underlying `div` element
 *
 * @example
 * <TabPanel value="overview">
 *   <Overview />
 * </TabPanel>
 *
 * @example
 * // keep the form (and anything typed into it) mounted while the panel is hidden
 * <TabPanel value="settings" keepMounted>
 *   <SettingsForm />
 * </TabPanel>
 */
export function TabPanel(props: TabPanelProps) {
  useTabsContext("TabPanel", "TabsRoot");
  const { value, ...rest } = props;

  return <BaseTabs.Panel {...rest} value={value} />;
}
