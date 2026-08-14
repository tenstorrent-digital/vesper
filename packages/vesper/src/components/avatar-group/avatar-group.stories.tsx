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

const avatars = [
  { src: "https://api.dicebear.com/10.x/initial-face/svg?seed=simon" },
  { src: "https://api.dicebear.com/10.x/initial-face/svg?seed=mackenzie" },
  { src: "https://api.dicebear.com/10.x/initial-face/svg?seed=keith" },
  { src: "https://api.dicebear.com/10.x/initial-face/svg?seed=neesh" },
  { src: "https://api.dicebear.com/10.x/initial-face/svg?seed=marisa" },
];

export const Playground: Story = {
  args: {
    size: "md",
    avatars,
  },
};

Playground.storyName = "avatar-group";
