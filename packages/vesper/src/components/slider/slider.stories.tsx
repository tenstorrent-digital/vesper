import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "@/components/slider/slider";

const meta = {
  component: Slider,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
};
Playground.storyName = "slider";
