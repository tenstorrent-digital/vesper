import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "@/components/switch/switch";

const meta = {
  component: Switch,
  parameters: { layout: "centered" },
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    label: "Label",
    disabled: false,
  },
};
Playground.storyName = "switch";
