import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider, SLIDER_VARIANTS } from "@/components/slider/slider";

const meta = {
  component: Slider,
  argTypes: {
    value: { table: { disable: true } },
    style: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    onValueCommit: { table: { disable: true } },
    thumbAriaLabel: { table: { disable: true } },
    valueLabel: { table: { disable: true } },
    name: { table: { disable: true } },
    form: { table: { disable: true } },
    ref: { table: { disable: true } },
    variant: { control: "radio", options: SLIDER_VARIANTS },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    style: { width: "min(calc(100vw - 4rem), 400px)" },
    min: 0,
    max: 10,
    step: 1,
    showTicks: false,
    showValueLabel: false,
    disabled: false,
    thumbAriaLabel: "Volume",
    variant: "default",
  },
};
Playground.storyName = "slider";
