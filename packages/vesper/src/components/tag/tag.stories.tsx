import type { Meta, StoryObj } from "@storybook/react-vite";

import { Globe } from "@/components/icons/icons";
import { Tag } from "@/components/tag/tag";

const meta = {
  component: Tag,
  argTypes: {
    icon: { control: "boolean" },
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    size: "lg",
    children: "Label",
    disabled: false,
    icon: true,
  },
  render({ icon = false, ...props }) {
    return <Tag icon={icon && <Globe />} {...props} />;
  },
};
Playground.storyName = "tag";
