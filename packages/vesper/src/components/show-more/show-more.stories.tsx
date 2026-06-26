import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/internal/preview-api";

import { ShowMore } from "@/components/show-more/show-more";

const meta = {
  component: ShowMore,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShowMore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {},
  render: function Render() {
    const [showMore, setShowMore] = useState(false);

    return (
      <ShowMore
        style={{ width: "min(calc(100vw - 4rem), 800px)" }}
        showMore={showMore}
        onClick={() => setShowMore(!showMore)}
      />
    );
  },
};
Playground.storyName = "show-more";
