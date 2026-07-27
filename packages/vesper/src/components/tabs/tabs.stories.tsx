import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@/components/icons/icons";
import { Tabs, TABS_VARIANTS, type TabsVariant } from "@/components/tabs/tabs";
import { Typography } from "@/components/typography/typography";

const TabsStoryComponent = ({
  tab1Label,
  tab1Icon,
  tab2Label,
  tab2Icon,
  tab3Label,
  tab3Icon,
  variant,
}: {
  tab1Label: string;
  tab1Icon: boolean;
  tab2Label: string;
  tab2Icon: boolean;
  tab3Label: string;
  tab3Icon: boolean;
  variant: TabsVariant;
}) => {
  return (
    <Tabs
      variant={variant}
      // defaultValue="tab-1"
      items={[
        {
          value: "tab-1",
          label: tab1Label,
          icon: tab1Icon && <Globe />,
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
          icon: tab2Icon && <Globe />,
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
          icon: tab3Icon && <Globe />,
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
  argTypes: {
    variant: { control: "radio", options: TABS_VARIANTS },
  },
} satisfies Meta<typeof TabsStoryComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "primary",
    tab1Label: "Tab 1",
    tab1Icon: true,
    tab2Label: "Tab 2",
    tab2Icon: false,
    tab3Label: "Tab 3",
    tab3Icon: false,
  },
};
Playground.storyName = "tabs";
