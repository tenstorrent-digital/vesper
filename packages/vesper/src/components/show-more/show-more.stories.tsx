import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "storybook/internal/preview-api";

import { ShowMore } from "@/components/show-more/show-more";

const meta = {
  component: ShowMore,
  argTypes: {
    onClick: { table: { disable: true } },
  },
} satisfies Meta<typeof ShowMore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    expanded: false,
    disabled: false,
  },
  render: function Render({ expanded: _expanded, disabled }) {
    const [expanded, setExpanded] = useState(_expanded);
    useEffect(() => setExpanded(_expanded), [_expanded]);

    return (
      <ShowMore
        style={{ width: "min(calc(100vw - 4rem), 800px)" }}
        expanded={expanded}
        disabled={disabled}
        onClick={() => setExpanded(!expanded)}
      />
    );
  },
};
Playground.storyName = "show-more";
