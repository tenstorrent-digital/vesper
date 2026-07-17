import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tenstorrent } from "@/components/icons/icons";
import { TextButton } from "@/components/text-button/text-button";

const meta = {
  component: TextButton,
  argTypes: {
    as: { table: { disable: true } },
    iconLeft: { control: "boolean" },
    iconRight: { control: "boolean" },
  },
} satisfies Meta<typeof TextButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "accent",
    size: "lg",
    children: "Explore",
    disabled: false,
    iconLeft: false,
    iconRight: false,
  },
  render: ({ iconLeft = false, iconRight = false, ...props }) => (
    <TextButton
      {...props}
      iconLeft={iconLeft && <Tenstorrent />}
      iconRight={iconRight && <Tenstorrent />}
    />
  ),
};
Playground.storyName = "text-button";
