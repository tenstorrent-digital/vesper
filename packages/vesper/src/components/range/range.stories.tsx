import type { Meta, StoryObj } from "@storybook/react-vite";

import { Range } from "@/components/range/range";

const meta = {
  component: Range,
  parameters: { layout: "centered" },
  argTypes: {
    values: { table: { disable: true } },
    style: { table: { disable: true } },
    defaultValues: { table: { disable: true } },
    onValuesChange: { table: { disable: true } },
    onValuesCommit: { table: { disable: true } },
  },
} satisfies Meta<typeof Range>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    style: { width: "min(calc(100vw - 4rem), 400px)" },
    min: 0,
    max: 10,
    step: 1,
    showTicks: true,
    showValueLabels: true,
    minStepsBetweenThumbs: 1,
    disabled: false,
    thumbAriaLabels: ["Volume (min)", "Volume (max)"],
  },
};
Playground.storyName = "range";
