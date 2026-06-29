import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/checkbox/checkbox";

const meta = {
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    defaultChecked: { table: { disable: true } },
    checked: { table: { disable: true } },
    name: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    label: "Label",
    disabled: false,
    indeterminate: true,
    required: false,
    defaultChecked: true,
  },
};
Playground.storyName = "checkbox";
