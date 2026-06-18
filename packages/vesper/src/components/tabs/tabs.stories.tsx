import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "@/components/tabs/tabs";
import { Typography } from "@/components/typography/typography";

const TabsStoryComponent = ({
  tab1Label,
  tab2Label,
  tab3Label,
}: {
  tab1Label: string;
  tab2Label: string;
  tab3Label: string;
}) => {
  return (
    <Tabs
      defaultValue="tab-1"
      items={[
        {
          value: "tab-1",
          label: tab1Label,
          content: (
            <Typography
              style={{
                color: "var(--vesper-stone-900)",
                padding: "var(--vesper-spacing-3) 0",
              }}
            >
              Tab 1 Content
            </Typography>
          ),
        },
        {
          value: "tab-2",
          label: tab2Label,
          content: (
            <Typography
              style={{
                color: "var(--vesper-stone-900)",
                padding: "var(--vesper-spacing-3) 0",
              }}
            >
              Tab 2 Content
            </Typography>
          ),
        },
        {
          value: "tab-3",
          label: tab3Label,
          content: (
            <Typography
              style={{
                color: "var(--vesper-stone-900)",
                padding: "var(--vesper-spacing-3) 0",
              }}
            >
              Tab 3 Content
            </Typography>
          ),
        },
      ]}
    />
  );
};

const meta = {
  component: TabsStoryComponent,
  parameters: { layout: "centered" },
  argTypes: {
    tab1Label: { name: "Tab 1 Label" },
    tab2Label: { name: "Tab 2 Label" },
    tab3Label: { name: "Tab 3 Label" },
  },
} satisfies Meta<typeof TabsStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    tab1Label: "Tab 1",
    tab2Label: "Tab 2",
    tab3Label: "Tab 3",
  },
};
Playground.storyName = "tabs";
