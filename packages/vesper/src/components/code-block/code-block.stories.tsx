import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock } from "@/components/code-block/code-block";

const meta = {
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "const count: number = 123",
    lang: "typescript",
  },
};
Playground.storyName = "code-block";
