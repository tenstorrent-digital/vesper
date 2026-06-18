import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "@/components/chip/chip";
import { AI, CaretDown } from "@/components/icons/icons";

const meta = {
  component: Chip,
  parameters: { layout: "centered" },
  argTypes: {
    as: { table: { disable: true } },
    onChange: { table: { disable: true } },
    iconLeft: { control: "boolean" },
    iconRight: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "Label",
    variant: "default",
    selected: false,
    disabled: false,
    iconLeft: false,
    iconRight: false,
  },
  render: ({ iconLeft, iconRight, ...props }) => (
    <Chip
      iconLeft={iconLeft && <AI />}
      iconRight={iconRight && <CaretDown />}
      {...props}
    />
  ),
};
Playground.storyName = "chip";
