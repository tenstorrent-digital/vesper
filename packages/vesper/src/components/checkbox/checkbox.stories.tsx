import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/checkbox/checkbox";

const meta = {
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    defaultChecked: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    label: "Label",
    disabled: false,
    defaultChecked: "indeterminate",
    required: false,
  },
};
Playground.storyName = "checkbox";
