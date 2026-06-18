import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextInput } from "@/components/text-input/text-input";
import { Globe } from "@/components/icons/icons";

const meta = {
  component: TextInput,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    placeholder: "This is placeholder text",
    icon: <Globe />,
  },
};
Playground.storyName = "text-input";
