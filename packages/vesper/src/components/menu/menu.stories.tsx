import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/button/button";
import { Blackhole, Globe, Tenstorrent } from "@/components/icons/icons";
import { Menu } from "@/components/menu/menu";

const meta = {
  component: Menu,
  argTypes: {
    items: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    container: { table: { disable: true } },
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    items: [
      {
        text: "Label",
        description: "The description",
        icon: <Tenstorrent />,
        style: "default",
        onSelect() {},
      },
      {
        text: "Label",
        description: "The description",
        icon: <Globe />,
        style: "selected",
        onSelect() {},
      },
      {
        text: "Label",
        description: "The description",
        icon: <Blackhole />,
        style: "danger",
        onSelect() {},
      },
      {
        text: "Label",
        description: "The description",
        style: "locked",
        onSelect() {},
      },
      {
        text: "Label",
        description: "The description",
        style: "disabled",
        onSelect() {},
      },
    ],
    width: 200,
    sideOffset: 8,
    side: "bottom",
    align: "start",
    alignOffset: 0,
  },
  render: (props) => (
    <Menu {...props} open>
      <Button size="lg" variant="contrast">
        menu trigger
      </Button>
    </Menu>
  ),
};
Playground.storyName = "menu";
