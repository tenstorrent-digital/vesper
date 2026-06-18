import {
  Tabs as RadixTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsProps as RadixTabsProps,
} from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export interface TabsProps extends Omit<RadixTabsProps, "orientation"> {
  items: { label: string; value: string; content: ReactNode }[];
}

export function Tabs({ items, className, ...props }: TabsProps) {
  return (
    <RadixTabs className={cn("vesper-tabs", className)} {...props}>
      <TabsList className="vesper-tabs-list">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="vesper-tabs-trigger"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent asChild key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </RadixTabs>
  );
}
