import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock, setupCodeBlock } from "@/components/code-block/code-block";

const meta = {
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

await setupCodeBlock({ langs: [import("@shikijs/langs/typescript")] });

export const Playground: Story = {
  args: {
    code: "const count: number = 123",
    lang: "typescript",
    showLineNumbers: false,
    style: { width: "min(calc(100vw - 4rem), 400px)" },
  },
};
Playground.storyName = "code-block";
