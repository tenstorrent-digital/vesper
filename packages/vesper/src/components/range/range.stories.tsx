import type { Meta, StoryObj } from "@storybook/react-vite";

import { Range } from "@/components/range/range";

const meta = {
  component: Range,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Range>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "range";
