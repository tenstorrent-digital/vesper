import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code } from "@/components/code/code";

const meta = {
  component: Code,
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "code";
