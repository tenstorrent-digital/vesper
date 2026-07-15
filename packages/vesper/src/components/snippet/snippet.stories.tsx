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
    code: `cd tt-studio\nrun.py --dev --skip-fastapi`,
    variant: "default",
  },
};
Playground.storyName = "snippet";
