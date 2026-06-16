import type { Meta, StoryObj } from "@storybook/react-vite";

import { Admonition } from "@/components/admonition/admonition";

const meta = {
  component: Admonition,
  parameters: { layout: "centered" },
  argTypes: {
    as: { table: { disable: true } },
    ctaAs: { table: { disable: true } },
    cta: { control: "boolean" },
  },
} satisfies Meta<typeof Admonition>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    size: "sm",
    variant: "info",
    subtle: false,
    // eslint-disable-next-line
    cta: false as any,
    children: "This is a line of copy that explains something",
  },
  render: ({ cta, ...props }) => (
    <Admonition
      style={{ width: "min(calc(100vw - 4rem), 400px)" }}
      cta={cta ? { children: "explore" } : undefined}
      {...props}
    />
  ),
};
Playground.storyName = "admonition";
