import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "@/components/typography/typography";

const meta = {
  component: Typography,
  argTypes: {
    as: { table: { disable: true } },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: "copy-sm", children: "Typography" },
  render: (props) => (
    <Typography style={{ color: "var(--vesper-stone-900)" }} {...props} />
  ),
};
Playground.storyName = "typography";
