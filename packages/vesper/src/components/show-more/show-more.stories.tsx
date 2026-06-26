import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "storybook/internal/preview-api";

import { ShowMore } from "@/components/show-more/show-more";

const meta = {
  component: ShowMore,
  parameters: { layout: "centered" },
  argTypes: {
    onClick: { table: { disable: true } },
  },
} satisfies Meta<typeof ShowMore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    isOpen: false,
  },
  render: function Render({ isOpen: _isOpen }) {
    const [isOpen, setIsOpen] = useState(_isOpen);
    useEffect(() => setIsOpen(_isOpen), [_isOpen]);

    return (
      <ShowMore
        style={{ width: "min(calc(100vw - 4rem), 800px)" }}
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
    );
  },
};
Playground.storyName = "show-more";
