import type { Meta, StoryObj } from "@storybook/react-vite";

import { Choicebox } from "@/components/choicebox/choicebox";

const meta = {
  component: Choicebox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Choicebox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "choicebox";
