import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProgressBar } from "@/components/progress-bar/progress-bar";

const meta = {
  component: ProgressBar,
  argTypes: {
    value: {
      control: {
        type: "number",
        min: 0,
        max: 100,
        step: 1,
      },
    },
    stepRoundingStrategy: { table: { disable: true } },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "md",
    variant: "default",
    steps: 10,
    value: 23,
    animated: false,
  },
  render: (props) => (
    <ProgressBar
      {...props}
      style={{ width: "min(calc(100vw - 4rem), 400px)" }}
    />
  ),
};
Playground.storyName = "progress-bar";
