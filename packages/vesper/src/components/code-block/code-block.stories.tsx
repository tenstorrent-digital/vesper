import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock, setupCodeBlock } from "@/components/code-block/code-block";

const meta = {
  component: CodeBlock,
  argTypes: {
    style: { table: { disable: true } },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

await setupCodeBlock({ langs: [import("@shikijs/langs/typescript")] });

const SAMPLE_CODE = `export interface MyComponentProps {
  name: string
  description: string
}

export function MyComponent(props: MyComponentProps) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>{props.description}</p>
    </div>
  )
}`;

export const Playground: Story = {
  args: {
    code: SAMPLE_CODE,
    lang: "typescript",
    showLineNumbers: false,
    style: { width: "min(calc(100vw - 4rem), 600px)" },
  },
};
Playground.storyName = "code-block";
