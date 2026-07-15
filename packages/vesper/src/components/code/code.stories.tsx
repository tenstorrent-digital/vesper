import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, CODE_VARIANTS } from "@/components/code/code";
import { Typography } from "../typography/typography";

const meta = {
  component: Code,
  argTypes: {
    variant: { control: "radio", options: CODE_VARIANTS },
  },
} satisfies Meta<typeof Code>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: "default",
    children: "codeReference",
  },
  render(props) {
    return (
      <Typography style={{ color: "var(--vesper-stone-900)" }}>
        This is a sentence with an inline <Code {...props} /> in it.
      </Typography>
    );
  },
};
Playground.storyName = "code";
