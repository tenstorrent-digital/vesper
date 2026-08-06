import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Typography } from "@/components/typography/typography";

const meta = {
  component: Tooltip,
  argTypes: {
    content: { control: "text" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    children: { table: { disable: true } },
    container: { table: { disable: true } },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    content: "The tooltip text",
    side: "top",
    align: "center",
    sideOffset: 4,
    alignOffset: 0,
    delayDuration: 500,
    maxWidth: 240,
  },
  render: (props) => (
    <Tooltip {...props}>
      <Typography style={{ color: "var(--vesper-stone-900)" }}>
        hover over me
      </Typography>
    </Tooltip>
  ),
};
Playground.storyName = "tooltip";
