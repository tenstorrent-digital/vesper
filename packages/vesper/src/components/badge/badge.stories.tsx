import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@/components/badge/badge";
import { Tenstorrent } from "@/components/icon/tenstorrent";

const meta = {
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    as: { table: { disable: true } },
    icon: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "accent",
    size: "lg",
    children: "Label",
    subtle: false,
    icon: false,
  },
  render: ({ icon = false, ...props }) => (
    <Badge {...props} icon={icon && <Tenstorrent />} />
  ),
};
Playground.storyName = "badge";
