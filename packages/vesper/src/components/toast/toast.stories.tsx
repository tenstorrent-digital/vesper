import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toast } from "@/components/toast/toast";

const meta = {
  component: Toast,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "toast";
