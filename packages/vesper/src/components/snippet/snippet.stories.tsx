import type { Meta, StoryObj } from "@storybook/react-vite";

import { Snippet } from "@/components/snippet/snippet";

const meta = {
  component: Snippet,
} satisfies Meta<typeof Snippet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "snippet";
