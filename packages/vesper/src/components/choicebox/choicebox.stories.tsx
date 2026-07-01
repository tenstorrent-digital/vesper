import type { Meta, StoryObj } from "@storybook/react-vite";

import { Choicebox } from "@/components/choicebox/choicebox";

const meta = {
  component: Choicebox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Choicebox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    name: "example",
    options: [
      {
        label: "Option A",
        value: "option-a",
        description: "This is a description",
      },
      {
        label: "Option B",
        value: "option-b",
        description: "This is a description",
      },
      {
        label: "Option C",
        value: "option-c",
        description: "This is a description",
        disabled: true,
      },
    ],
    multiselect: false,
    disabled: false,
    defaultValue: "option-c",
    style: { width: "min(calc(100vw - 4rem), 400px)" },
  },
};
Playground.storyName = "choicebox";
