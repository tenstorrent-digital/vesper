import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "@/components/select/select";

const meta = {
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    options: [],
    size: "lg",
    placeholder: "Select an option",
  },
};
Playground.storyName = "select";
