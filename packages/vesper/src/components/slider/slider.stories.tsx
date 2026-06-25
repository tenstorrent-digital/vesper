import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "@/components/slider/slider";

const meta = {
  component: Slider,
  parameters: { layout: "centered" },
  argTypes: {
    value: { table: { disable: true } },
    style: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onValueCommit: { table: { disable: true } },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    valueLabel: "<1B",
    style: { width: "min(calc(100vw - 4rem), 400px)" },
    min: 0,
    max: 10,
    step: 1,
    showTicks: true,
    showValueLabel: true,
  },
};
Playground.storyName = "slider";
