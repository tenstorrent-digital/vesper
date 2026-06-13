import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/button/button";
import { Tenstorrent } from "@/components/icon/tenstorrent";

const meta = {
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    showLeftIcon: { control: "boolean", name: "Show left icon?" },
    showRightIcon: { control: "boolean", name: "Show right icon?" },
    variant: { name: "Variant" },
    size: { name: "Size" },
    disabled: { name: "Disabled?" },
    children: { name: "Button text" },
    iconLeft: { control: false, table: { disable: true } },
    iconRight: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    as: { control: false, table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Explore",
    disabled: false,
    showLeftIcon: false,
    showRightIcon: false,
  },
  render: ({ showLeftIcon = false, showRightIcon = false, ...props }) => (
    <Button
      {...props}
      iconLeft={showLeftIcon && <Tenstorrent />}
      iconRight={showRightIcon && <Tenstorrent />}
    />
  ),
};
Playground.storyName = "button";
