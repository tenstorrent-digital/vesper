import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextInput } from "@/components/text-input/text-input";

const meta = {
  component: TextInput,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "text-input";
