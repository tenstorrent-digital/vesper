import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "@/components/tag/tag";

const meta = {
  component: Tag,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "tag";
