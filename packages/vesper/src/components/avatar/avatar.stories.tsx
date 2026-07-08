import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@/components/avatar/avatar";

const meta = {
  component: Avatar,
  argTypes: {
    as: { table: { disable: true } },
    alt: { table: { disable: true } },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    src: "https://unsplash.it/400/400",
  },
};
Playground.storyName = "avatar";
