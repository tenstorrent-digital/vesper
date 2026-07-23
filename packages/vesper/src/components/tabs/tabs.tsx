import { ComponentProps, Fragment, isValidElement, ReactNode } from "react";
import {
  Tabs as RadixTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@radix-ui/react-tabs";

import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const TABS_VARIANTS = ["primary", "secondary"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];

export interface TabsProps extends Omit<
  ComponentProps<"div">,
  "children" | "dir"
> {
  /** The visual style variant of the tabs. Defaults to `"primary"`. */
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
  /** Whether a tab is activated automatically (when receiving focus) or manually (when clicked). Defaults to `"automatic"`. */
  activationMode?: "automatic" | "manual";
}

const TRIGGER_TYPOGRAPHY: { [V in TabsVariant]: TypographyVariant } = {
  primary: "label-md",
  secondary: "label-sm",
};

export function Tabs(props: TabsProps) {
  const { items, className, variant = "primary", ...rest } = props;

  return (
    <RadixTabs className={cn(`vesper-tabs-${variant}`, className)} {...rest}>
      <TabsList className="vesper-tabs-list">
        {items.map((item) => (
          <Typography
            as={TabsTrigger}
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
      </TabsList>
      {items.map((item) => (
        <TabsContent asChild key={item.value} value={item.value}>
          {isValidElement(item.content) && item.content.type !== Fragment ? (
            item.content
          ) : (
            <span>{item.content}</span>
          )}
        </TabsContent>
      ))}
    </RadixTabs>
  );
}
