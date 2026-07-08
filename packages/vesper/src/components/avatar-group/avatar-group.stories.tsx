import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "@/components/avatar-group/avatar-group";

const meta = {
  component: AvatarGroup,
  argTypes: {
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    avatars: Array.from({ length: 5 }).map((_, index) => ({
      src: `https://unsplash.it/${(index + 1) * 150}/${(index + 1) * 150}`,
    })),
  },
};

Playground.storyName = "avatar-group";
