import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "@/components/icon-button/icon-button";
import { ICON_KINDS, Icon, type IconKind } from "@/components/icons/icons";

const meta = {
  component: IconButton,
  argTypes: {
    as: { table: { disable: true } },
    icon: { control: "select", options: ICON_KINDS },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "primary",
    icon: "tenstorrent",
    size: "lg",
    disabled: false,
  },
  render: ({ icon = "tenstorrent", ...props }) => (
    <IconButton {...props} icon={icon && <Icon kind={icon as IconKind} />} />
  ),
};
Playground.storyName = "icon-button";
