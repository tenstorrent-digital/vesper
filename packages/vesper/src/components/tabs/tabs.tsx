import { Fragment, isValidElement, ReactNode } from "react";
import {
  Tabs as RadixTabs,
  TabsContent,
  TabsList,
  type TabsProps as RadixTabsProps,
  TabsTrigger,
} from "@radix-ui/react-tabs";

import {
  Typography,
  TypographyVariant,
} from "@/components/typography/typography";

import { cn } from "@/utils/cn";

export const TABS_VARIANTS = ["primary", "secondary"] as const;

export type TabsVariant = (typeof TABS_VARIANTS)[number];

export interface TabsProps extends Omit<RadixTabsProps, "orientation"> {
  variant?: TabsVariant;
  items: {
    label: string;
    value: string;
    icon?: ReactNode;
    content: ReactNode;
  }[];
}

const TRIGGER_TYPOGRAPHY: { [V in TabsVariant]: TypographyVariant } = {
  primary: "label-md",
  secondary: "label-sm",
};

export function Tabs({
  items,
  className,
  variant = "primary",
  ...props
}: TabsProps) {
  return (
    <RadixTabs className={cn(`vesper-tabs-${variant}`, className)} {...props}>
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
