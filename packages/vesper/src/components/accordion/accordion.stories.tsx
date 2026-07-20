import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion } from "@/components/accordion/accordion";

const meta = {
  component: Accordion,
  argTypes: {
    defaultOpen: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    title: "This is an accordion",
    children:
      "If you do too much it's going to lose its effectiveness. Look around. Look at what we have. Beauty is everywhere you only have to look to see it.",
  },
  render: (props) => (
    <Accordion style={{ width: "min(calc(100vw - 4rem), 400px)" }} {...props} />
  ),
};
Playground.storyName = "accordion";
