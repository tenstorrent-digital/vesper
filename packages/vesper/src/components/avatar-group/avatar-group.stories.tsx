import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "@/components/avatar-group/avatar-group";

const meta = {
  component: AvatarGroup,
  parameters: { layout: "centered" },
  argTypes: {
    avatars: { control: "number" },
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    avatars: 5 as any,
  },
  render: ({ avatars: numAvatars = 3, ...props }) => {
    const avatars = Array.from({ length: numAvatars as number }).map(
      (_, index) => ({
        src: `https://unsplash.it/${(index + 1) * 150}/${(index + 1) * 150}`,
      }),
    );

    return <AvatarGroup avatars={avatars} {...props} />;
  },
};

Playground.storyName = "avatar-group";
