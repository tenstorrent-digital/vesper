import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sheet } from "@/components/sheet/sheet";

const meta = {
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "sheet";
