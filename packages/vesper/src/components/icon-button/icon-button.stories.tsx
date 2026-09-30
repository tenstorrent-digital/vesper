import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton } from "@/components/icon-button/icon-button";
import { Icon, ICON_KINDS, type IconKind } from "@/components/icons/icons";

// the `icon` control selects an icon kind (instead of the `ReactNode` the prop expects)
const isIconKind = (value: unknown): value is IconKind =>
  ICON_KINDS.some((kind) => kind === value);

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
    size: "md",
    disabled: false,
  },
  render: ({ icon = "tenstorrent", ...props }) => (
    <IconButton
      {...props}
      icon={isIconKind(icon) ? <Icon kind={icon} /> : icon}
    />
  ),
};
Playground.storyName = "icon-button";
