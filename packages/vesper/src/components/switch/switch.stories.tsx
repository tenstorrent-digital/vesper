import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "@/components/switch/switch";

const meta = {
  component: Switch,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
  },
};
Playground.storyName = "switch";
