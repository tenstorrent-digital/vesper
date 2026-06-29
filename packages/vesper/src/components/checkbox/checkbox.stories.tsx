import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "@/components/checkbox/checkbox";

const meta = {
  component: Checkbox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "checkbox";
