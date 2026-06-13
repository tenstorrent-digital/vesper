import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/button/button";
import { Tenstorrent } from "@/components/icon/tenstorrent";

const meta = {
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    iconLeft: { control: "boolean" },
    iconRight: { control: "boolean" },
    as: { table: { disable: true } },
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
    iconLeft: false,
    iconRight: false,
  },
  render: ({ iconLeft = false, iconRight = false, ...props }) => (
    <Button
      {...props}
      iconLeft={iconLeft && <Tenstorrent />}
      iconRight={iconRight && <Tenstorrent />}
    />
  ),
};
Playground.storyName = "button";
