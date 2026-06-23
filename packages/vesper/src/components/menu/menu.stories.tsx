import type { Meta, StoryObj } from "@storybook/react-vite";

import { Menu } from "@/components/menu/menu";
import { Tenstorrent, Globe, Blackhole } from "@/components/icons/icons";
import { TextButton } from "@/components/text-button/text-button";

const meta = {
  component: Menu,
  parameters: { layout: "centered" },
  argTypes: {},
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
  },
  render: (props) => (
    <Menu {...props}>
      <TextButton size="lg" variant="contrast">
        click me
      </TextButton>
    </Menu>
  ),
};
Playground.storyName = "menu";
