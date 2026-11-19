import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@/components/icons/icons";
import {
  TABS_VARIANTS,
  TabsRoot,
  TabsList,
  TabTrigger,
  TabPanel,
  type TabsVariant,
} from "@/components/tabs/tabs";
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
    <TabsRoot variant={variant}>
      <TabsList>
        <TabTrigger value="tab-1" icon={tab1Icon && <Globe />}>
          {tab1Label}
        </TabTrigger>
        <TabTrigger value="tab-2" icon={tab2Icon && <Globe />}>
          {tab2Label}
        </TabTrigger>
        <TabTrigger value="tab-3" icon={tab3Icon && <Globe />}>
          {tab3Label}
        </TabTrigger>
      </TabsList>
      <TabPanel value="tab-1">
        <Typography
          style={{
            color: "var(--vesper-color-stone-900)",
            padding: "var(--vesper-spacing-3) 0",
          }}
        >
          Tab 1 Content
        </Typography>
      </TabPanel>
      <TabPanel value="tab-2">
        <Typography
          style={{
            color: "var(--vesper-color-stone-900)",
            padding: "var(--vesper-spacing-3) 0",
          }}
        >
          Tab 2 Content
        </Typography>
      </TabPanel>
      <TabPanel value="tab-3">
        <Typography
          style={{
            color: "var(--vesper-color-stone-900)",
            padding: "var(--vesper-spacing-3) 0",
          }}
        >
          Tab 3 Content
        </Typography>
      </TabPanel>
    </TabsRoot>
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
