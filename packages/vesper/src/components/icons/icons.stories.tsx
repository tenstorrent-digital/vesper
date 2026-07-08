import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "@/components/icons/icons";

const meta = {
  component: Icon,
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { kind: "tenstorrent" },
  render: (props) => (
    <Icon width={32} height={32} color="var(--vesper-stone-900)" {...props} />
  ),
};
Playground.storyName = "icons";
