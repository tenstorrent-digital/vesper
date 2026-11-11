import type { Meta, StoryObj } from "@storybook/react-vite";

import { Snippet, SNIPPET_VARIANTS } from "@/components/snippet/snippet";

const meta = {
  component: Snippet,
  argTypes: {
    variant: { control: "radio", options: SNIPPET_VARIANTS },
  },
} satisfies Meta<typeof Snippet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: `cd tt-studio\nrun.py --dev --skip-fastapi`,
    variant: "default",
    style: { width: "min(calc(100vw - 4rem), 400px)" },
  },
};
Playground.storyName = "snippet";
