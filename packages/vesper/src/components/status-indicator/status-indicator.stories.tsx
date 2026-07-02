import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusIndicator } from "@/components/status-indicator/status-indicator";

const meta = {
  component: StatusIndicator,
  parameters: { layout: "centered" },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "status-indicator";
