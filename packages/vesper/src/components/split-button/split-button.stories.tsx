import type { Meta, StoryObj } from "@storybook/react-vite";

import { SplitButton } from "@/components/split-button/split-button";
import { Tenstorrent, Globe, Blackhole } from "@/components/icons/icons";

const meta = {
  component: SplitButton,
  parameters: { layout: "centered" },
  argTypes: {
    onClick: { table: { disable: true } },
    menuButtonAriaLabel: { table: { disable: true } },
    className: { table: { disable: true } },
    menuOpen: { table: { disable: true } },
    defaultMenuOpen: { table: { disable: true } },
    onMenuOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof SplitButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    menuItems: [
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
    size: "lg",
    variant: "subtle",
    children: "Button text",
    menuWidth: 200,
    menuAlign: "start",
    menuAlignOffset: 0,
    menuSide: "bottom",
    menuSideOffset: 8,
    disabled: false,
  },
};
Playground.storyName = "split-button";
